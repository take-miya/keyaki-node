const debug = require('debug')('model'),
    Config = require('config'),
    knex = require('knex')(Config.db);

exports.getAll = function () {
    debug('get all members');
    return knex.select('id', 'name').from('members').whereNull('deleted').then(function(rows) {
        const members = {};
        rows.map(function(row) {
            members[row.name] = row.id;
        });
        return Promise.resolve(members);
    });
};