const debug = require('debug')('daemons'),
    Config = require('config'),
    co = require('co'),
    sleep = require('sleep-promise'),
    Member = require('./model/member'),
    BlogShell = require('./shell/blog'),
    TopicShell = require('./shell/topics');

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
}

co(function*() {
    yield [Member.getAll().then(blogDaemon), topicDaemon()];
}).catch(function(err) {
    debug('err', err);
    process.exit();
})
