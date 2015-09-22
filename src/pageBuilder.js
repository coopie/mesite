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
    return new Promise(function(fulfill) {
        return fulfill('<h1>Index Page!!!</h1>');
    });
}

function buildAboutPage() {
    return new Promise(function(fulfill) {
        return fulfill('<h1>About Page!!!</h1>');
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
