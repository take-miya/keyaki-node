const debug = require('debug')('shell'),
    Mail = require('../lib/mail'),
    client = require('cheerio-httpcli');

const fetchSite = function () {
    const url = 'http://eplus.jp/sys/T1U14P0010163P0108P002176645P0050001P006001P0030003';
    debug(`fetched url: ${url}`);
    return client.fetch(url).then(function (result) {
        const $ = result.$;
        let isSuccess = true;
        $('td[class=eventStatus]').map(function () {
            if ($(this).find('p').text() === '一般発売・予定枚数終了') isSuccess = false;
        });
        if (isSuccess) return Promise.resolve(url);
        return Promise.resolve();
    });
};

const sendMail = function (url) {
    if (!url) return Promise.resolve();
    return Mail.send('eplus', url);
}


const execute = function (members) {
    debug('ticket[eplus] shell execute')
    return fetchSite().then(sendMail);
};
exports.execute = execute;
execute();