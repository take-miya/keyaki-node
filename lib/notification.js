const debug = require('debug')('lib'),
    Config = require('config'),
    gcm = require('node-gcm');

exports.push = function (tokens, title, action, body, data) {
    debug('tokens', tokens);
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

    return new Promise(function (resolve, reject) {
        sender.sendNoRetry(message, { registrationTokens: tokens }, function (err, response) {
            debug('response', response);
            if (err) reject(err);
            else resolve(response);
        });
    });
}