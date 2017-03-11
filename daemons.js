const Config = require('config'),
    co = require('co'),
    sleep = require('sleep-promise'),
    Member = require('./model/member'),
    Matome = require('./model/matome'),
    BlogShell = require('./shell/blog'),
    PostShell = require('./shell/post'),
    TopicShell = require('./shell/topics'),
    MatomeShell = require('./shell/matome'),
    HmvShell = require('./shell/hmv'),
    CnShell = require('./shell/cn'),
    EplusShell = require('./shell/eplus'),
    RakutenShell = require('./shell/rakuten');

const blogDaemon = function (members) {
    console.log(`blog daemon start:${Date.now()}`);
    return BlogShell.execute(members).then(function () {
        return sleep(Config.daemons.blog.interval);
    }).then(function () {
        return blogDaemon(members);
    });
};

const postDaemon = function () {
    console.log(`post daemon start:${Date.now()}`);
    return PostShell.execute().then(function () {
        return sleep(Config.daemons.blog.interval);
    }).then(function () {
        return postDaemon();
    });
};

const topicDaemon = function () {
    console.log(`topics daemon start:${Date.now()}`);
    return TopicShell.execute().then(function () {
        return sleep(Config.daemons.topics.interval);
    }).then(function () {
        return topicDaemon();
    });
};

const matomeDaemon = function (matomes) {
    console.log(`matome daemon start:${Date.now()}`);
    return Promise.all(matomes.map(function (matome) {
        return MatomeShell.execute(matome);
    })).then(function () {
        return sleep(Config.daemons.matome.interval);
    }).then(function () {
        return matomeDaemon(matomes);
    });
};

const ticketDaemon = function () {
    return Promise.all([
        //HmvShell.execute(),
        //CnShell.execute(),
        //EplusShell.execute(),
        Rakuten.execute()
    ]).then(function () {
        return sleep(60000);
    }).then(ticketDaemon);
}

co(function* () {
    console.log('daemons start');
    yield [Member.getAll().then(blogDaemon), postDaemon(), topicDaemon(), Matome.getAll().then(matomeDaemon), ticketDaemon()];
}).catch(function (err) {
    console.log(err);
    process.exit();
})
