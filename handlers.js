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
                        row.published = moment(row.published).format();
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
    co(function* () {
        req.checkQuery('word', 'word is required').notEmpty();
        const result = yield req.getValidationResult();
        if (!result.isEmpty()) throw new Error('validation error');
        debug('query', req.query);
        const word = req.query.word || '';
        const ids = yield knex.select('id')
            .from('posts')
            .where('text', 'LIKE', `%${word}%`)
            .orderBy('modified', 'desc')
            .then(function (rows) {
                return Promise.all(rows.map(function (row) {
                    return row.id;
                }));
            });
        debug('ids', ids);
        res.json({ result: 'success', ids: ids });
        next();
    }).catch(next);
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
        res.json({ result: 'success', last_updated: lastUpdated, photos: photos });
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
                        row.published = moment(row.published).format();
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
            knex.select('id', 'url', 'title', 'site', 'published', 'deleted')
                .from('pages')
                .where('modified', '>', updatedFrom)
                .orderBy('modified', 'desc')
                .then(function (rows) {
                    return Promise.all(rows.map(function (row) {
                        row.published = moment(row.published).format();
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
    co(function* () {
        req.checkBody('user.token', 'token is required').notEmpty();
        const result = yield req.getValidationResult();
        if (!result.isEmpty()) throw new Error('validation error');
        debug('user', req.body.user);

        const [exist] = yield knex.select('id')
            .from('users')
            .where('token', '=', req.body.user.token);

        if (!exist) {
            yield knex('users')
                .insert(Object.assign(req.body.user, { created: moment().format("YYYY-MM-DD HH:mm:ss"), modified: moment().format("YYYY-MM-DD HH:mm:ss") }));
        } else {
            yield knex('users')
                .update(Object.assign(req.body.user, { modified: moment().format("YYYY-MM-DD HH:mm:ss") }))
                .where('token', '=', req.body.user.token);
        }

        const [user] = yield knex.select('id', 'token', 'pushable_members', 'pushable_members2', 'pushable_matomes')
            .from('users')
            .where('token', '=', req.body.user.token);
        debug('user', user)
        res.json({ result: 'success', user: user });
    }).catch(next);
};