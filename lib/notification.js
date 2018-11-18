const debug = require('debug')('lib'),
    Config = require('config'),
    gcm = require('node-gcm'),
    sleep = require('sleep-promise'),
    chunk = require('chunk');

exports.gcmPush = function (tokens, title, action, body, data) {
    const sender = new gcm.Sender(Config.notification.api_key, { proxy: 'https://gcm-http.googleapis.com/gcm/send' });
    const message = new gcm.Message({
        priority: 'high',
        dryRun: Config.notification.dry_run,
        data: data,
        notification: {
            title: title,
            icon: '@mipmap/notification',
            click_action: action,
            body: body,
            sound: 'default',
        }
    });
    const chunkedTokens = chunk(tokens, 1000);
    debug('chunkedTokens', chunkedTokens);
    let p = sleep(Config.notification.interval);

    chunkedTokens.map(function (chunkedToken) {
        p = p.then(function () {
            return new Promise(function (resolve, reject) {
                debug('chunkedToken', chunkedToken);
                sender.sendNoRetry(message, { registrationTokens: chunkedToken }, function (err, response) {
                    debug('response', response);
                    if (err) reject(err);
                    else resolve(response);
                });
            });
        }).then(function() {
            return sleep(Config.notification.interval);
        });
    });
    return p;
}

exports.push = function (tokens, title, action, body, data) {
    const sender = new gcm.Sender(Config.notification.api_key);
    const message = new gcm.Message({
        priority: 'high',
        dryRun: Config.notification.dry_run,
        data: data,
        notification: {
            title: title,
            icon: '@mipmap/notification',
            click_action: action,
            body: body,
            sound: 'default',
        }
    });
    const chunkedTokens = chunk(tokens, 1000);
    debug('chunkedTokens', chunkedTokens);
    let p = sleep(Config.notification.interval);

    chunkedTokens.map(function (chunkedToken) {
        p = p.then(function () {
            return new Promise(function (resolve, reject) {
                debug('chunkedToken', chunkedToken);
                sender.sendNoRetry(message, { registrationTokens: chunkedToken }, function (err, response) {
                    debug('response', response);
                    debug('err', err);
                    if (err) reject(err);
                    else resolve(response);
                });
            });
        }).then(function() {
            return sleep(Config.notification.interval);
        });
    });
    return p;
}

