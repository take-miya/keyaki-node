const debug = require('debug')('shell'),
    Mail = require('../lib/mail'),
    client = require('cheerio-httpcli');

const fetchSite = function () {
    const url = 'http://l-tike-aaa.com/order/?gLcode=39990&gPfKey=20170117000000109163&gEntryMthd=01&gScheduleNo=1&gCarrierCd=01&gPfName=%E3%81%A4%E3%81%B6%E3%82%84%E3%81%8D%EF%BC%A6%EF%BC%A5%EF%BC%B3%E5%8D%9A%E6%AC%85%E5%A0%B4%E6%89%80%EF%BD%9E%EF%BC%A7%EF%BC%B5%EF%BC%AD%E3%80%80%EF%BC%B2%EF%BC%AF%EF%BC%A3%EF%BC%AB%E3%80%80%EF%BC%A6%EF%BC%A5%EF%BC%B3%EF%BC%92%EF%BD%9E&gBaseVenueCd=31809&version=PC';
    debug(`fetched url: ${url}`);
    return client.fetch(url).then(function (result) {
        const $ = result.$;
        let isSuccess = true;
        $('img').map(function () {
            if ($(this).attr('src') === 'http://cdn.l-tike.com/image/pc/ico/ico_seatState03.png') isSuccess = false;
        });
        if (!isSuccess) return Promise.resolve();
        debug('success', $('img'));
        return Promise.resolve(url);
    }).catch(function(err) {
        debug('err', err);
    });
};

const sendMail = function (url) {
    if (!url) return Promise.resolve();
    return Mail.send('hmv', url);
}


const execute = function (members) {
    debug('ticket[hmv] shell execute')
    return fetchSite().then(sendMail);
};
exports.execute = execute;