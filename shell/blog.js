const debug = require('debug')('shell'),
    Member = require('../model/member'),
    Notification = require('../lib/notification'),
    Config = require('config'),
    moment = require('moment'),
    knex = require('knex')(Config.db),
    client = require('cheerio-httpcli');

const getPosts = function (members) {
    const url = Config.daemons.blog.url.index;
    debug(`fetched url: ${url}`);
    return client.fetch(url).then(function (result) {
        const $ = result.$;
        return Promise.all($('div[class=box-newposts]').find('li').map(function () {
            const postId = ($(this).find('a').attr('href')).match(/detail\/([0-9]+)/)[1];
            const postTitle = $($(this).find('p')[0]).text().trim();
            const memberName = $($(this).find('p')[1]).text().trim();
            const m = $(this).find('time').text().trim().match(/^([0-9]+)\.([0-9]+)\.([0-9]+) ([0-9]+):([0-9]+)/);
            const postDate = new Date(m[1], m[2], m[3], m[4], m[5]);
            return { id: postId, title: postTitle, member_id: members[memberName], member_name: memberName, published: postDate };
        }).get());
    });
};

const saveAndPushIfNotExist = function (post) {
    return knex.select('id').from('posts').where('id', '=', post.id).then(function ([row]) {
        if (!row) return saveAndPush(post);
        debug(`exist post_id: ${post.id}`);
        return Promise.resolve(post);
    });
};

const saveAndPush = function (post) {
    debug('post', post);
    return save(post).then(function () {
        return push(post);
    });
};

const save = function (post) {
    debug(`save post: ${post.id}`);
    const row = Object.assign({}, post,  { created: moment().format("YYYY-MM-DD HH:mm:ss"), modified: moment().format("YYYY-MM-DD HH:mm:ss") });
    delete row.member_name;
    return knex('posts').insert(row);
};

const push = function (post) {
    debug(`push post: ${post.id}`);
    let p;
    if (post.member_id < 33) {
        memberIdBit = 1 << (post.member_id - 1);
        debug('memberIdBit', memberIdBit);
        p = knex.select('token').from('users').where('pushable_members', '&', memberIdBit);
    } else if (post.member_id < 65) {
        debug('memberIdBit', memberIdBit);
        memberIdBit = 1 << (post.member_id - 33);
        p = knex.select('token').from('users').where('pushable_members2', '&', memberIdBit);
    } else {
        p = knex.select('token').from('users');
    }

    return p.then(function (rows) {
        return Promise.all(rows.map(function (row) {
            return row.token;
        }));
    }).then(function (tokens) {
        return Notification.push(tokens, post.member_name, 'TAKEMIYA_KEYAKI_NOTIFICATION_OFFICIAL_BLOG_UPDATE', post.title, { url: Config.daemons.blog.url.detail + '/' + post.id });
    });
}

const execute = function (members) {
    debug('blog shell execute')
    let p;
    if (!members) {
        p = Member.getAll();
    } else p = Promise.resolve(members);
    return p.then(getPosts).then(function(posts) {
        return Promise.all(posts.map(saveAndPushIfNotExist));
    });
};
exports.execute = execute;