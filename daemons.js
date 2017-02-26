const debug = require('debug')('daemons'),
    Config = require('config'),
    co = require('co'),
    sleep = require('sleep-promise'),
    Member = require('./model/member'),
    Matome = require('./model/matome'),
    BlogShell = require('./shell/blog'),
    TopicShell = require('./shell/topics'),
    MatomeShell = require('./shell/matome'),
    HmvShell = require('./shell/hmv'),
    CnShell = require('./shell/cn'),
    EplusShell = require('./shell/eplus');

const blogDaemon = function (members) {
    debug(`blog daemon start:${Date.now()}`);
    return BlogShell.execute(members).then(function () {
        return sleep(Config.daemons.blog.interval);
    }).then(function () {
        return blogDaemon(members);
    });
};

const topicDaemon = function () {
    debug(`topics daemon start:${Date.now()}`);
    return TopicShell.execute().then(function () {
        return sleep(Config.daemons.topics.interval);
    }).then(function () {
        return topicDaemon();
    });
};

const matomeDaemon = function (matomes) {
    debug(`matome daemon start:${Date.now()}`);
    return Promise.all(matomes.map(function (matome) {
        return MatomeShell.execute(matome);
    })).then(function () {
        return sleep(Config.daemons.matome.interval);
    }).then(function () {
        return matomeDaemon();
    });
};

const ticketDaemon = function () {
    return Promise.all([
        HmvShell.execute(),
        CnShell.execute(),
        EplusShell.execute()
    ]).then(function () {
        return sleep(60000);
    }).then(ticketDaemon);
}

co(function* () {
    debug('daemons start');
    yield [Member.getAll().then(blogDaemon), topicDaemon(), Matome.getAll().then(matomeDaemon), ticketDaemon()];
}).catch(function (err) {
    debug('err', err);
    process.exit();
})
