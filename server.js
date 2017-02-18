const express = require('express'),
    app = express(),
    debug = require('debug')('server'),
    handlers = require('./handlers');

app.listen(3030, function() {
    debug("Node.js is listening to PORT: 3030");
});

app.get('/members/index', handlers.getMembers);
app.get('/matomes/index', handlers.getMatomes);
app.get('/posts/index', handlers.getPosts);
app.get('/photos/index', handlers.getPhotos);
app.get('/topics/index', handlers.getTopics);
app.get('/pages/index', handlers.getPages);
app.post('/users/add', handlers.addUser);
app.post('/users/edit', handlers.editUser);

app.use(function(err, req, res, next) {
    debug('err', err);
    if (!res.headersSent) res.status(500).send({ result: 'failure' });
    next();
})