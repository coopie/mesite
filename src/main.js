var http = require('http');
var dispatch = require('dispatch');
var pageBuilder = require('./pageBuilder');

var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8087;
console.log(process);

var dispatcher = dispatch({
    '/': function(request, response) {
        pageBuilder.buildIndex()
        .then(function(page) {
            deliverPage(response, page);
        });
    },
    '/about': function(request, response) {
        pageBuilder.buildAboutPage()
        .then(function(page) {
            deliverPage(response, page);
        });
    },
    '/posts/:post': function(request, response, post) {
        pageBuilder.buildPost(post)
        .then(function(page) {
            deliverPage(response, page);
        });
    },
    '/:other': function(request, response) {
        response.writeHead(404);
        response.end('404: There\'s nothing here');
    }
});

function deliverPage(response, page) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(page);
    response.end();
}

var server = http.createServer(function(request, response) {
    try {
        dispatcher(request, response);
    } catch (err) {
        console.error(err);
        response.writeHead(500);
        response.end('Internal Server Error');
    }
});

pageBuilder.initialise().then(function() {
    server.listen(PORT, function() {
        console.log('Server listening on: http://localhost:%s', PORT);
    });
});
