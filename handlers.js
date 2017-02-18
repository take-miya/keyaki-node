const debug = require('debug')('handler'),
    Config = require('config'),
    co = require('co'),
    knex = require('knex')(Config.db);

exports.getMembers = function(req, res, next) {
    co(function*() {
        debug('query', req.query);
        const updatedFrom = req.query.updated_from || '2000-01-01T00:00:00+0900';
        debug('updatedFrom', updatedFrom);
        const [members, [lastUpdated]] = yield [
            knex.select('id', 'name', 'deleted')
            .from('members')
            .where('modified', '>', updatedFrom)
            .orderBy('modified', 'desc')
            .then(function(rows) {
                return Promise.resolve({ members: rows });
            }),
            knex('members').max('modified as last_updated')
        ];
        debug('members', members);
        debug('lastUpdated', lastUpdated);
        res.json(Object.assign({ result: 'success' }, lastUpdated, members));
        next();
    }).catch(next);
};

exports.getMatomes = function(req, res, next) {
    co(function*() {
        debug('query', req.query);
        const updatedFrom = req.query.updated_from || '2000-01-01T00:00:00+0900';
        debug('updatedFrom', updatedFrom);
        const [matomes, [lastUpdated]] = yield [
            knex.select('id', 'title', 'feed', 'deleted')
            .from('matomes')
            .where('modified', '>', updatedFrom)
            .orderBy('modified', 'desc')
            .then(function(rows) {
                return Promise.resolve({ matomes: rows });
            }),
            knex('matomes').max('modified as last_updated')
        ];
        debug('matomes', matomes);
        debug('lastUpdated', lastUpdated);
        res.json(Object.assign({ result: 'success' }, lastUpdated, matomes));
        next();
    }).catch(next);
};

exports.getPosts = function(req, res, next) {
    co(function*() {
        debug('query', req.query);
        const updatedFrom = req.query.updated_from || '2000-01-01T00:00:00+0900';
        debug('updatedFrom', updatedFrom);
        const [posts, [lastUpdated]] = yield [
            knex.select('id', 'member_id', 'title', 'twitter_media_url', 'published', 'deleted')
            .from('posts')
            .where('modified', '>', updatedFrom)
            .orderBy('modified', 'desc')
            .then(function(rows) {
                return Promise.resolve({ posts: rows });
            }),
            knex('posts').max('modified as last_updated')
        ];
        debug('posts', posts);
        debug('lastUpdated', lastUpdated);
        res.json(Object.assign({ result: 'success' }, lastUpdated, posts));
        next();
    }).catch(next);
};

exports.searchWord = function(req, res, next) {

};

exports.getPhotos = function(req, res, next) {
    co(function*() {
        debug('query', req.query);
        const updatedFrom = req.query.updated_from || '2000-01-01T00:00:00+0900';
        debug('updatedFrom', updatedFrom);
        const [photos, [lastUpdated]] = yield [
            knex.select('id', 'url', 'post_id', 'deleted')
            .from('photos')
            .where('modified', '>', updatedFrom)
            .orderBy('modified', 'desc')
            .then(function(rows) {
                return Promise.resolve({ photos: rows });
            }),
            knex('photos').max('modified as last_updated')
        ];
        debug('photos', photos);
        debug('lastUpdated', lastUpdated);
        res.json(Object.assign({ result: 'success' }, lastUpdated, photos));
        next();
    }).catch(next);
};

exports.getTopics = function(req, res, next) {
    co(function*() {
        debug('query', req.query);
        const updatedFrom = req.query.updated_from || '2000-01-01T00:00:00+0900';
        debug('updatedFrom', updatedFrom);
        const [topics, [lastUpdated]] = yield [
            knex.select('id', 'title', 'published')
            .from('topics')
            .where('modified', '>', updatedFrom)
            .orderBy('modified', 'desc')
            .then(function(rows) {
                return Promise.resolve({ topics: rows });
            }),
            knex('topics').max('modified as last_updated')
        ];
        debug('topics', topics);
        debug('lastUpdated', lastUpdated);
        res.json(Object.assign({ result: 'success' }, lastUpdated, topics));
        next();
    }).catch(next);
};

exports.getPages = function(req, res, next) {
    co(function*() {
        debug('query', req.query);
        const updatedFrom = req.query.updated_from || '2000-01-01T00:00:00+0900';
        debug('updatedFrom', updatedFrom);
        const [pages, [lastUpdated]] = yield [
            knex.select('id', 'url', 'title', 'published', 'deleted')
            .from('pages')
            .where('modified', '>', updatedFrom)
            .orderBy('modified', 'desc')
            .then(function(rows) {
                return Promise.resolve({ pages: rows });
            }),
            knex('pages').max('modified as last_updated')
        ];
        debug('pages', pages);
        debug('lastUpdated', lastUpdated);
        res.json(Object.assign({ result: 'success' }, lastUpdated, pages));
        next();
    }).catch(next);
};

exports.addUser = function(req, res, next) {

};

exports.editUser = function(req, res, next) {

};