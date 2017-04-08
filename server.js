const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    Config = require('config'),
    Mail = require('./lib/mail'),
    debug = require('debug')('server'),
    handlers = require('./handlers');

app.listen(Config.port, function() {
    debug("Node.js is listening to PORT: " + Config.port);
});

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(expressValidator());

app.get('/members/index', handlers.getMembers);
app.get('/matomes/index', handlers.getMatomes);
app.get('/posts/index', handlers.getPosts);
app.get('/posts/search', handlers.searchWord);
app.get('/photos/index', handlers.getPhotos);
app.get('/topics/index', handlers.getTopics);
app.get('/pages/index', handlers.getPages);
app.post('/users/add', handlers.addUser);
app.post('/users/edit', handlers.addUser);

app.use(function(req, res, next) {
    if (res.headersSent) return next();
    debug('err', 'NOT FOUND');
    res.status(404).send({ result: 'not found' });
    next('aaa');
});

app.use(function(err, req, res, next) {
    debug('err', err);
    if (!res.headersSent) res.status(500).send({ result: 'failure' });
    Mail.send('error', err).then(function() {
        next();
    }).catch(next);
});

app.use(function(err, req, res, next) {
    debug('err', err);
});