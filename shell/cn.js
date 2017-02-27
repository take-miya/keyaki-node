const debug = require('debug')('shell'),
    Mail = require('../lib/mail'),
    client = require('cheerio-httpcli');

const fetchSite = function () {
    const url = 'https://www.cnplayguide.com/evt/evtdtl.aspx?ecd=CNI20158&sid=A61583747d3c734e25b0ba8d355f449d0e7400c12d&dmf=1';
    debug(`fetched url: ${url}`);
    return client.fetch(url).then(function (result) {
        const $ = result.$;
        let isSuccess = true;
        $('td[class=fm]').map(function () {
            if ($(this).text() === '18:30×') isSuccess = false;
        });
        if (!isSuccess) return Promise.resolve();
        debug('success', $('td[class=fm]'));
        return Promise.resolve(url);
    }).catch(function(err) {
        debug('err', err);
    });
};

const sendMail = function (url) {
    if (!url) return Promise.resolve();
    return Mail.send('cn', url);
}


const execute = function (members) {
    debug('ticket[cn] shell execute')
    return fetchSite().then(sendMail);
};
exports.execute = execute;