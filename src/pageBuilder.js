var Promise = require('bluebird');
var marked = require('marked');
var fs = require('fs');
Promise.promisifyAll(fs);
var Handlebars = require('handlebars');
var prettyDate = require('pretty-date');
var Intl = require('intl');

var template;
var postEntryTemplate;
var dateFormatter = new Intl.DateTimeFormat('en-UK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Builds the page and postEntry templates.
function initialise() {
    var buildPageTemplate = fs.readFileAsync('page-templates/page.html')
    .then(function(data) {
        page = Handlebars.compile(data.toString());

        return Promise.props({
            head: openFileToString('page-templates/head.html'),
            header: openFileToString('page-templates/header.html')
            // footer: openFileToString('page-templates/footer.html', 'utf-8')
        }).then(function(handlebarsContext) {
            template = function(pageSpecificContent) {
                handlebarsContext.content = pageSpecificContent.mainContent;
                handlebarsContext.footer = pageSpecificContent.footer;
                return page(handlebarsContext);
            };
        });
    });

    var buildPostTemplate = fs.readFileAsync('page-templates/postentry.html')
    .then(function(data) {
        postEntry = Handlebars.compile(data.toString());
        postEntryTemplate = function(context) {
            return postEntry(context);
        };
    });

    return Promise.all([buildPageTemplate, buildPostTemplate]);

    function openFileToString(path) {
        return fs.readFileAsync(path)
        .then(function(data) {
            return data.toString();
        });
    }
}

function buildPost(postName) {
    return fs.readFileAsync('posts/' + postName + '.md')
    .then(function(data) {
        var postAndMetadata = extractMetaData(data.toString());
        var post = postAndMetadata.post;
        // title = postAndMetadata.title || "";
        // var postHeader = marked('# ' + title + '\n');
        var postHeader = postAndMetadata.title ? marked('# ' + postAndMetadata.title + '\n') : '';
        if (postName !== 'aboutme') {
            var date =  dateFormatter.format(new Date(postAndMetadata.date));
            postHeader += marked('##### *' + date + '*') + '\n';
        }
        postHeader += '<link rel="stylesheet" href="/resource/styles/code.css">' +
            '<script src="/resource/script/highlight.pack.js"></script>' +
            '<script>hljs.initHighlightingOnLoad();</script>';

        return template({
            mainContent: postHeader + marked(post),
            footer: postAndMetadata.footer || 'hoc quoque finiet  גם זה יעבור‎  لا شيء يدوم this too shall pass'
        });

    });
}

function buildIndex() {
    var aboutAndGithub = '<span style="text-align:center">' +
        '<h3>' + '<a href="https://github.com/coopie">github</a>' +
        ' \t <a href="/about">about me</a></h3>' +
        '</span>';
    return getSortedListOfPosts()
    .then(function(posts) {
        var postList = '';
        posts.forEach(function(post) {
            postList += postEntryTemplate({
                title: post.title,
                date: prettyDate.format(new Date(post.date)),
                link: linkTo(post.name),
            });
        });
        postList += '';
        return template({
            mainContent: aboutAndGithub + postList,
            footer: 'We learn through repetition. We learn through repetition. We learn through repetition'
        });
    });
}

function buildAboutPage() {
    return buildPost('aboutme');
}

function getSortedListOfPosts() {
    return fs.readdirAsync('posts')
    .then(function(files) {
        var all = [];
        files.forEach(function(file) {
            if (file === 'aboutme.md') {
                return;
            }
            all.push(fs.readFileAsync('posts/' + file)
            .then(function(data) {
                var metaData = extractMetaData(data.toString());
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

    metaData.post = file;
    return metaData;
}

function linkTo(post, text) {
    return 'posts/' + post.slice(0, (-1) * '.md'.length);
}

module.exports = {
    initialise: initialise,
    buildPost: buildPost,
    buildIndex: buildIndex,
    buildAboutPage: buildAboutPage
};
