const debug = require('debug')('handler'),
    Config = require('config'),
    co = require('co'),
    moment = require('moment'),
    knex = require('knex')(Config.db);

exports.getMembers = function (req, res, next) {
    co(function* () {
        debug('query', req.query);
        const updatedFrom = req.query.updated_from || '2000-01-01T00:00:00+0900';
        debug('updatedFrom', updatedFrom);
        const [members, lastUpdated] = yield [
            knex.select('id', 'name', 'deleted')
                .from('members')
                .where('modified', '>', updatedFrom)
                .orderBy('modified', 'desc')
                .then(function (rows) {
                    return Promise.all(rows.map(function (row) {
                        row.deleted = row.deleted ? moment(row.deleted).format() : null;
                        return row;
                    }));
                }),
            knex('members')
                .max('modified as last_updated')
                .then(function ([row]) {
                    return Promise.resolve(moment(row.last_updated).format());
                })
        ];
        debug('members', members);
        debug('lastUpdated', lastUpdated);
        res.json({ result: 'success', last_updated: lastUpdated, members: members });
        next();
    }).catch(next);
};

exports.getMatomes = function (req, res, next) {
    co(function* () {
        debug('query', req.query);
        const updatedFrom = req.query.updated_from || '2000-01-01T00:00:00+0900';
        debug('updatedFrom', updatedFrom);
        const [matomes, lastUpdated] = yield [
            knex.select('id', 'title', 'feed', 'deleted')
                .from('matomes')
                .where('modified', '>', updatedFrom)
                .orderBy('modified', 'desc')
                .then(function (rows) {
                    return Promise.all(rows.map(function (row) {
                        row.deleted = row.deleted ? moment(row.deleted).format() : null;
                        return row;
                    }));
                }),
            knex('matomes')
                .max('modified as last_updated')
                .then(function ([row]) {
                    return Promise.resolve(moment(row.last_updated).format());
                })
        ];
        debug('matomes', matomes);
        debug('lastUpdated', lastUpdated);
        res.json({ result: 'success', last_updated: lastUpdated, matomes: matomes });
        next();
    }).catch(next);
};

exports.getPosts = function (req, res, next) {
    co(function* () {
        debug('query', req.query);
        const updatedFrom = req.query.updated_from || '2000-01-01T00:00:00+0900';
        debug('updatedFrom', updatedFrom);
        const [posts, lastUpdated] = yield [
            knex.select('id', 'member_id', 'title', 'twitter_media_url', 'published', 'deleted')
                .from('posts')
                .where('modified', '>', updatedFrom)
                .orderBy('modified', 'desc')
                .then(function (rows) {
                    return Promise.all(rows.map(function (row) {
                        row.deleted = row.deleted ? moment(row.deleted).format() : null;
                        return row;
                    }));
                }),
            knex('posts')
                .max('modified as last_updated')
                .then(function ([row]) {
                    return Promise.resolve(moment(row.last_updated).format());
                })
        ];
        debug('posts', posts);
        debug('lastUpdated', lastUpdated);
        res.json({ result: 'success', last_updated: lastUpdated, posts: posts });
        next();
    }).catch(next);
};

exports.searchWord = function (req, res, next) {

};

exports.getPhotos = function (req, res, next) {
    co(function* () {
        debug('query', req.query);
        const updatedFrom = req.query.updated_from || '2000-01-01T00:00:00+0900';
        debug('updatedFrom', updatedFrom);
        const [photos, lastUpdated] = yield [
            knex.select('id', 'url', 'post_id', 'deleted')
                .from('photos')
                .where('modified', '>', updatedFrom)
                .orderBy('modified', 'desc')
                .then(function (rows) {
                    return Promise.all(rows.map(function (row) {
                        row.deleted = row.deleted ? moment(row.deleted).format() : null;
                        return row;
                    }));
                }),
            knex('photos')
                .max('modified as last_updated')
                .then(function ([row]) {
                    return Promise.resolve(moment(row.last_updated).format());
                })
        ];
        debug('photos', photos);
        debug('lastUpdated', lastUpdated);
        res.json({ result: 'success', last_updated: lastUpdated, photos: phptos });
        next();
    }).catch(next);
};

exports.getTopics = function (req, res, next) {
    co(function* () {
        debug('query', req.query);
        const updatedFrom = req.query.updated_from || '2000-01-01T00:00:00+0900';
        debug('updatedFrom', updatedFrom);
        const [topics, lastUpdated] = yield [
            knex.select('id', 'title', 'published')
                .from('topics')
                .where('modified', '>', updatedFrom)
                .orderBy('modified', 'desc')
                .then(function (rows) {
                    return Promise.all(rows.map(function (row) {
                        row.deleted = row.deleted ? moment(row.deleted).format() : null;
                        return row;
                    }));
                }),
            knex('topics')
                .max('modified as last_updated')
                .then(function ([row]) {
                    return Promise.resolve(moment(row.last_updated).format());
                })
        ];
        debug('topics', topics);
        debug('lastUpdated', lastUpdated);
        res.json({ result: 'success', last_updated: lastUpdated, topics: topics });
        next();
    }).catch(next);
};

exports.getPages = function (req, res, next) {
    co(function* () {
        debug('query', req.query);
        const updatedFrom = req.query.updated_from || '2000-01-01T00:00:00+0900';
        debug('updatedFrom', updatedFrom);
        const [pages, lastUpdated] = yield [
            knex.select('id', 'url', 'title', 'published', 'deleted')
                .from('pages')
                .where('modified', '>', updatedFrom)
                .orderBy('modified', 'desc')
                .then(function (rows) {
                    return Promise.all(rows.map(function (row) {
                        row.deleted = row.deleted ? moment(row.deleted).format() : null;
                        return row;
                    }));
                }),
            knex('pages')
                .max('modified as last_updated')
                .then(function ([row]) {
                    return Promise.resolve(moment(row.last_updated).format());
                })
        ];
        debug('pages', pages);
        debug('lastUpdated', lastUpdated);
        res.json({ result: 'success', last_updated: lastUpdated, pages: pages });
        next();
    }).catch(next);
};

exports.addUser = function (req, res, next) {

};

exports.editUser = function (req, res, next) {

};