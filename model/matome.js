const debug = require('debug')('model'),
    Config = require('config'),
    knex = require('knex')(Config.db);

exports.getAll = function () {
    debug('get all matomes');
    return knex.select('id', 'title', 'feed').from('matomes').whereNull('deleted');
};