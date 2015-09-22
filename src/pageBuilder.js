var React = require('react');
var Promise = require('bluebird');
var marked = require('marked');
var fs = require('fs');
Promise.promisifyAll(fs);

var pageHeader;

var pageFooter;

function buildPost(postName) {
    return fs.readFileAsync('posts/' + postName + '.md')
    .then(function(data) {
        var fileAndMetadata = extractMetaData(data.toString());
        var file = fileAndMetadata.file;
        var metaData = fileAndMetadata.metaData;
        return marked(file);
    });
}

function buildIndex() {
    return getSortedListOfPosts()
    .then(function(posts) {
        console.log(JSON.stringify(posts, undefined, 4));
        return '<h1>INDEX</h1>';
    });
}

function buildAboutPage() {
    return new Promise(function(fulfill) {
        return fulfill('<h1>About Page!!!</h1>');
    });
}

function getSortedListOfPosts() {
    return fs.readdirAsync('posts')
    .then(function(files) {
        var all = [];
        files.forEach(function(file) {
            all.push(fs.readFileAsync('posts/' + file)
            .then(function(data) {
                return extractMetaData(data.toString()).metaData;
            }));
        });
        return Promise.all(all).then(function(fileInfos) {
            return fileInfos.sort(function(a, b) {
                return new Date(b.date) - new Date(a.date);
            });
        });
    });
}

var metaDataToken = '---';

function extractMetaData(file) {
    var metaData;
    file = file.slice(metaDataToken.length);

    metaData = file.slice(0, file.indexOf(metaDataToken));
    metaData = JSON.parse(metaData);

    file = file.slice(file.indexOf(metaDataToken) + metaDataToken.length);

    return {
        file: file,
        metaData: metaData
    };
}

module.exports = {
    buildPost: buildPost,
    buildIndex: buildIndex,
    buildAboutPage: buildAboutPage
};
