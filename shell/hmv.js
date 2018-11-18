const debug = require('debug')('shell'),
    Mail = require('../lib/mail'),
    client = require('cheerio-httpcli');

const fetchSite = function () {
    const url = 'http://l-tike.com/order/?gLcode=71779&gPfKey=20180529000000324106&gEntryMthd=02&gScheduleNo=2&gCarrierCd=08&gPfName=%E3%81%91%E3%82%84%E3%81%8D%E5%9D%82%EF%BC%94%EF%BC%96&gBaseVenueCd=31333'
    debug(`fetched url: ${url}`);
    return client.fetch(url).then(function (result) {
        const $ = result.$;
        let isSuccess = true;
        $('img').map(function (idx) {
            if (idx===6 && $(this).attr('src') === 'http://cdn.l-tike.com/image/pc/ico/ico_seatState03.png') isSuccess = false;
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
