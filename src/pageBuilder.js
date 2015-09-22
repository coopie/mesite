var Promise = require('bluebird');
var marked = require('marked');
var fs = require('fs');
Promise.promisifyAll(fs);
var Handlebars = require('handlebars');

var template;
// Builds the page template for the page to compile the main content into
function initialise() {
    return fs.readFileAsync('page-templates/page.html')
    .then(function(data) {
        page = Handlebars.compile(data.toString());

        return Promise.props({
            head: openFileToString('page-templates/head.html'),
            header: openFileToString('page-templates/header.html'),
            footer: openFileToString('page-templates/footer.html')
        }).then(function(handlebarsContext) {
            template = function(pageContent) {
                handlebarsContext.content = pageContent;
                return page(handlebarsContext);
            };
        });

        function openFileToString(path) {
            return fs.readFileAsync(path)
            .then(function(data) {
                return data.toString();
            });
        }
    });
}

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
        var postList = '<ul>';
        posts.forEach(function(post) {
            postList += '<li>' + post.date +
            ': ' + linkTo(post.name, post.title) +
            '</li>';
        });
        postList += '</ul>';
        return template(postList);
    });
}

function buildAboutPage() {
    return new Promise(function(fulfill) {
        fulfill('<h1>About Page!!!</h1>');
    });
}

function getSortedListOfPosts() {
    return fs.readdirAsync('posts')
    .then(function(files) {
        var all = [];
        files.forEach(function(file) {
            all.push(fs.readFileAsync('posts/' + file)
            .then(function(data) {
                var metaData = extractMetaData(data.toString()).metaData;
                metaData.name = file;
                return metaData;
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

function linkTo(post, text) {
    return marked('[' + text + ']' + '(posts/' + post.slice(0, -3) + ')');
}

module.exports = {
    initialise: initialise,
    buildPost: buildPost,
    buildIndex: buildIndex,
    buildAboutPage: buildAboutPage
};
