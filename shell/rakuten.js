const debug = require('debug')('shell'),
    Mail = require('../lib/mail'),
    client = require('cheerio-httpcli');

const fetchSite = function () {
    const url = 'https://ticket.rakuten.co.jp/music/jpop/idle/RTZPADG';
    debug(`fetched url: ${url}`);
    return client.fetch(url).then(function (result) {
        const $ = result.$;
        let isFail = 0;
        $('img').map(function () {
            if ($(this).attr('alt') === '予定枚数終了') isFail++;
        });
        debug('isFail', isFail);
        if (isFail === 2) return Promise.resolve();
        return Promise.resolve(url);
    }).catch(function(err) {
        debug('err', err);
    });
};

const sendMail = function (url) {
    if (!url) return Promise.resolve();
    return Mail.send('rakuten', url);
}


const execute = function (members) {
    debug('ticket[rakuten] shell execute')
    return fetchSite().then(sendMail);
};
exports.execute = execute;
