const debug = require('debug')('shell'),
    Config = require('config'),
    moment = require('moment'),
    knex = require('knex')(Config.db),
    client = require('cheerio-httpcli')
    twitter = require('twitter');

const getPost = function () {
    const url = Config.daemons.blog.url.detail;
    debug(`fetched url: ${url}`);
    return client.fetch(url).then(function (result) {
        const $ = result.$;
        return Promise.all($('div[class=box-newposts]').find('li').map(function () {
            const postId = ($(this).find('a').attr('href')).match(/detail\/([0-9]+)/)[1];
            const postTitle = $($(this).find('p')[0]).text().trim();
            const memberName = $($(this).find('p')[1]).text().trim();
            const m = $(this).find('time').text().trim().match(/^([0-9]+)\.([0-9]+)\.([0-9]+) ([0-9]+):([0-9]+)/);
            const postDate = new Date(m[1], m[2] - 1, m[3], m[4], m[5]);
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
    const row = Object.assign({}, post, { created: moment().format("YYYY-MM-DD HH:mm:ss"), modified: moment().format("YYYY-MM-DD HH:mm:ss") });
    delete row.member_name;
    return knex('posts').insert(row);
};

const getPostsOfNoTweet = function () {
    debug('get post of no tweet');
    return knex.select('id').from('posts').whereNull('twitter_media_url').whereNull('deleted');
};

const tweetAndSaveDetail = function (post) {
    return getDetail(post).then(tweet).then(save);
};

const getDetail = function (post) {
    const url = Config.daemons.blog.url.detail + '/' + post.id;
    debug(`fetched url: ${url}`);
    return client.fetch(url).then(function (result) {
        console.log(result.$('div[class=box-article]').text().trim());
        return result.$('div[class=box-article]').text().trim();
    });
};

const tweet = function (detail) {

};

const execute = function () {
    debug('post shell execute')
    return Promise.resolve();
    // return getPostsOfNoTweet().then(function (posts) {
    //     return Promise.all(posts.map(tweetAndSaveDetail));
    // });
};
exports.execute = execute;