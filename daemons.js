const debug = require('debug')('daemons'),
    Config = require('config'),
    co = require('co'),
    sleep = require('sleep-promise'),
    Member = require('./model/member'),
    BlogShell = require('./shell/blog'),
    TopicShell = require('./shell/topics'),
    HmvShell = require('./shell/hmv'),
    CnShell = require('./shell/cn');

const blogDaemon = function (members) {
    debug(`blog daemon start:${Date.now()}`);
    return BlogShell.execute(members).then(function() {
        return sleep(Config.daemons.blog.interval);
    }).then(function() {
        return blogDaemon(members);
    });
};

const topicDaemon = function() {
    debug(`topics daemon start:${Date.now()}`);
    return TopicShell.execute().then(function() {
        return sleep(Config.daemons.topics.interval);
    }).then(function() {
        return topicDaemon();
    });
};

const ticketDamons = function () {
    return Promise.all([
        hmvDaemon(),
        cnDaemon()
    ]);
}

const hmvDaemon = function() {
    debug(`hmv daemon start:${Date.now()}`);
    return HmvShell.execute().then(function() {
        return sleep(60000);
    }).then(function() {
        return hmvDaemon();
    });
};

const cnDaemon = function() {
    debug(`cn daemon start:${Date.now()}`);
    return CnShell.execute().then(function() {
        return sleep(60000);
    }).then(function() {
        return cnDaemon();
    });
};

co(function*() {
    debug('daemons start');
    yield [Member.getAll().then(blogDaemon), topicDaemon(), ticketDaemons()];
}).catch(function(err) {
    debug('err', err);
    process.exit();
})
