const debug = require('debug')('shell'),
    Notification = require('../lib/notification'),
    Config = require('config'),
    moment = require('moment'),
    knex = require('knex')(Config.db),
    FeedParser = require('feedparser'),
    request = require('request');

const getItems = function (matome) {
    debug(`fetched feed: ${matome.feed}`);

    return new Promise(function (resolve, reject) {
        const req = request(matome.feed);
        const feedparser = new FeedParser();
        const items = [];

        req.on('error', function (err) {
debug('req error', err);
            reject(err);
        });

        req.on('response', function (res) {
            if (res.statusCode !== 200) {
                this.emit('error', new Error('Bad status code'));
            } else {
                this.pipe(feedparser);
            }
        });

        feedparser.on('error', function (err) {
debug('feed error', err);
            reject(err);
        });

        feedparser.on('readable', function () {
            while (item = this.read()) {
                items.push({ item: { matome_id: matome.id, title: item.title, url: item.link }, matome: { title: matome.title } });
            }
        });

        feedparser.on('end', function () {
            resolve(items);
        })
    });
};

const saveAndPushIfNotExist = function (item) {
    return knex.select('id').from('items').where({ matome_id: item.item.matome_id, url: item.item.url }).then(function ([row]) {
        if (!row) return saveAndPush(item);
        debug(`exist link: ${item.item.url}`);
        return Promise.resolve(item);
    });
};

const saveAndPush = function (item) {
    debug('item', item);
    return save(item.item).then(function () {
        return push(item);
    });
};

const save = function (item) {
    debug(`save item: ${item.url}`);
    const row = Object.assign({}, item, { created: moment().format("YYYY-MM-DD HH:mm:ss"), modified: moment().format("YYYY-MM-DD HH:mm:ss") });
    return knex('items').insert(row);
};

const push = function (item) {
    debug(`push item: ${item.item.url}`);

    matomeIdBit = 1 << (item.item.matome_id - 1);
    debug('matomeIdBit', matomeIdBit);

    return knex.select('token').from('users').where('pushable_matomes ', '&', matomeIdBit).then(function (rows) {
        return Promise.all(rows.map(function (row) {
            return row.token;
        }));
    }).then(function (tokens) {
        return Notification.push(tokens, item.matome.title, 'TAKEMIYA_KEYAKI_NOTIFICATION_MATOME_UPDATE', item.item.title, { url: item.item.url });
    });
}

const execute = function (matome) {
    debug('items shell execute');
    return getItems(matome).then(function (items) {
        return Promise.all(items.map(saveAndPushIfNotExist));   
    });
};
exports.execute = execute;
