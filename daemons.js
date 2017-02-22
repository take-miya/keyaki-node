const debug = require('debug')('daemons'),
    Config = require('config'),
    co = require('co'),
    sleep = require('sleep-promise'),
    Member = require('./model/member'),
    blogShell = require('./shell/blog');

const blogDaemon = function (members) {
    debug(`blog daemon start:${Date.now()}`);
    return blogShell.execute(members).then(function() {
        return sleep(Config.daemons.blog.interval);
    }).then(function() {
        return blogDaemon();
    });
};

co(function*() {
    yield Member.getAll().then(blogDaemon);
}).catch(function(err) {
    debug('err', err);
})
