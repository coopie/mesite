var React = require('react');
var Promise = require('bluebird');
var marked = require('marked');
var fs = require('fs');
Promise.promisifyAll(fs);

function buildPost(postName) {
    return fs.readFileAsync('posts/' + postName + '.md')
    .then(function(data) {
        return marked(data.toString());
    });
}

function buildIndex() {
    return new Promise(function(fulfill) {
        return fulfill('<h1>Index Page!!!</h1>');
    });
}

function buildAboutPage() {
    return new Promise(function(fulfill) {
        return fulfill('<h1>About Page!!!</h1>');
    });
}

module.exports = {
    buildPost: buildPost,
    buildIndex: buildIndex,
    buildAboutPage: buildAboutPage
};
