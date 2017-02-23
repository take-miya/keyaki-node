const debug = require('debug')('shell'),
    Notification = require('../lib/notification'),
    Config = require('config'),
    moment = require('moment'),
    knex = require('knex')(Config.db),
    client = require('cheerio-httpcli');

const getTopics = function () {
    const url = Config.daemons.top.url;
    debug(`fetched url: ${url}`);
    return client.fetch(url).then(function (result) {
        const $ = result.$;
        return Promise.all($('div[class=news]').find('li').map(function () {
            const topicId = ($(this).find('a').attr('href')).match(/detail\/([A-Z0-9]+)/)[1];
            const topicTitle = $($(this).find('a')[0]).text().trim();
            const m = $(this).find('time').text().trim().match(/^([0-9]+)\.([0-9]+)\.([0-9]+)/);
            const topicDate = new Date(m[1], m[2], m[3]);
            return { id: topicId, title: topicTitle, published: topicDate };
        }).get());
    });
};

const saveAndPushIfNotExist = function (topic) {
    return knex.select('id').from('topics').where('id', '=', topic.id).then(function ([row]) {
        if (!row) return saveAndPush(topic);
        debug(`exist topic_id: ${topic.id}`);
        return Promise.resolve(topic);
    });
};

const saveAndPush = function (topic) {
    debug('topic', topic);
    return save(topic).then(function () {
        return push(topic);
    });
};

const save = function (topic) {
    debug(`save topic: ${topic.id}`);
    const row = Object.assign({}, topic,  { created: moment().format("YYYY-MM-DD HH:mm:ss"), modified: moment().format("YYYY-MM-DD HH:mm:ss") });
    return knex('topics').insert(row);
};

const push = function (topic) {
    debug(`push topic: ${topic.id}`);

    return knex.select('token').from('users').then(function (rows) {
        return Promise.all(rows.map(function (row) {
            return row.token;
        }));
    }).then(function (tokens) {
        return Notification.push(tokens, '欅坂46ニュース', 'TAKEMIYA_KEYAKI_NOTIFICATION_OFFICIAL_NEWS_UPDATE', topic.title, { url: Config.daemons.topics.url + '/' + topic.id });
    });
}

const execute = function () {
    debug('topics shell execute');
    return getTopics().then(function(topics) {
        return Promise.all(topics.map(saveAndPushIfNotExist));
    });
};
exports.execute = execute;