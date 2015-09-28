---
{
    "title": "Sandbox Post with Lots of Different Things in",
    "date": "2015-09-22"
}
---
[what is this?](/resource/images/me.jpeg)

*Hello!* this is a test post for checking how things Look

---

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

(I really hope that all of this works)

![alt text](https://i.imgur.com/synonSr.png "Logo Title Text 1")

Some more text at the end of the post.

```javascript
var Promise = require('bluebird');
var marked = require('marked');
var fs = require('fs');
Promise.promisifyAll(fs);
var Handlebars = require('handlebars');
var prettyDate = require('pretty-date');

var template;
var postEntryTemplate;

// Builds the page and postEntry templates.
function initialise() {
    var buildPageTemplate = fs.readFileAsync('page-templates/page.html')
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
    });

    var buildPostTemplate = fs.readFileAsync('page-templates/postEntry.html')
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
        return template(marked('# ' + postAndMetadata.title) + '\n' +
            marked(post)
        );
    });
}

function buildIndex() {
    return getSortedListOfPosts()
    .then(function(posts) {
        var postList = '<ul>';
        posts.forEach(function(post) {
            postList += postEntryTemplate({
                title: post.title,
                date: prettyDate.format(new Date(post.date)),
                link: linkTo(post.name)
            });
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
```
