const Promise = require('bluebird');
const marked = require('marked');
const fs = require('fs');
Promise.promisifyAll(fs);
const Handlebars = require('handlebars');
const prettyDate = require('pretty-date');
const interpolate = require('color-interpolate');

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
        var postHeader = postAndMetadata.title ? marked('# ' + postAndMetadata.title + '\n') : '';
        if (postName !== 'aboutme') {
            if (postAndMetadata.date) {
                var date = dateFormatter.format(new Date(postAndMetadata.date));
                postHeader += marked('##### *' + date + '*') + '\n';
            }

        }
        postHeader +=
            '<link rel="stylesheet" href="/resource/styles/code.css">' +
            '<script src="/resource/script/highlight.pack.js"></script>' +
            '<script>hljs.initHighlightingOnLoad();</script>';

        if (postAndMetadata.style !== undefined) {
            postHeader += CustomPostCSS(postAndMetadata.style);
        }

        return template({
            mainContent: postHeader + marked(post),
            footer: postAndMetadata.footer || 'hoc quoque finiet  גם זה יעבור‎  لا شيء يدوم this too shall pass'
        });

    });
}

function buildIndex() {
    var aboutAndGithub =
    '<span style="text-align:center">' +
        '<h3>' +
            '<a href="https://github.com/coopie" class="samLink">github</a>' +
            ' · ' +
            '<a href="/about" class="samLink">about me</a>' +
            ' · ' +
            '<a href="https://www.instagram.com/cahooop/" class="samLink">instagram</a>' +
        '</h3>' +
    '</span>';

    return getSortedListOfPosts()
    .then(function(posts) {
        var postList = '';
        posts.forEach(function(post) {
            if (post.style !== undefined) {
                color1 = post.style.color1;
                color2 = post.style.color2;
            } else {
                color1 = 'var(--color0)';
                color2 = 'var(--color10)';
            }

            postList += postEntryTemplate({
                title: post.title,
                date: prettyDate.format(new Date(post.date)),
                link: linkTo(post.name),
                color1: color1,
                color2: color2
            });
        });
        postList += '';
        return template({
            mainContent: aboutAndGithub + postList,
            footer: 'We learn through repetition. We learn through repetition. We learn through repetition',
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
            if (file === 'aboutme.md' || file == 'CV.md') {
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

var METADATA_TOKEN = '---';
function extractMetaData(file) {
    var metaData;
    file = file.slice(METADATA_TOKEN.length);

    metaData = file.slice(0, file.indexOf(METADATA_TOKEN));
    metaData = JSON.parse(metaData);

    file = file.slice(file.indexOf(METADATA_TOKEN) + METADATA_TOKEN.length);

    metaData.post = file;
    return metaData;
}

function linkTo(post, text) {
    return 'posts/' + post.slice(0, (-1) * '.md'.length);
}

function CustomPostCSS(postStyleBlob) {
    // create the things from the other things
    const {color1, color2} = postStyleBlob;
    const colormap = interpolate([color1, color2]);
    return `
    <style>
    :root {
      --color0: ${colormap(0 / 10)};
      --color1: ${colormap(1 / 10)};
      --color2: ${colormap(2 / 10)};
      --color3: ${colormap(3 / 10)};
      --color4: ${colormap(4 / 10)};
      --color5: ${colormap(5 / 10)};
      --color6: ${colormap(6 / 10)};
      --color7: ${colormap(7 / 10)};
      --color8: ${colormap(8 / 10)};
      --color9: ${colormap(9 / 10)};
      --color10: ${colormap(10 / 10)};
    }
    </style>
    `;
}

module.exports = {
    initialise: initialise,
    buildPost: buildPost,
    buildIndex: buildIndex,
    buildAboutPage: buildAboutPage
};
