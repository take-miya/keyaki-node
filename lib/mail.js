const debug = require('debug')('lib'),
    sendmail = require('sendmail')();

exports.send = function (subject, html) {
    return new Promise(function(resolve, reject) {
        sendmail({ from: 'ticket@localhost', to: 'takehiro.miyao@gmail.com', subject: subject, html: html }, function(err, reply) {
            if (err) return reject(err);
            return resolve(reply);
        });
    });
};