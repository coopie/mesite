var pageBuilder = require('./pageBuilder');
var express = require('express');

var server = express();

var PORT = process.env.PORT || 8080;

server.get('/', function(request, response) {
    pageBuilder.buildIndex()
    .then(function(page) {
        deliverPage(response, page);
    });
});
server.get('/posts/:post', function(request, response) {
    pageBuilder.buildPost(request.params.post)
    .then(function(page) {
        deliverPage(response, page);
    });
});
//TODO: REMOVE THIS NEXT TIME I WRITE SOMEWHERE
server.get('/resume', function(request, response) {
    pageBuilder.buildPost('CV')
    .then(function(page) {
        deliverPage(response, page);
    });
});
server.get('/CV', function(request, response) {
    pageBuilder.buildPost('CV')
    .then(function(page) {
        deliverPage(response, page);
    });
});
server.get('/about', function(request, response) {
    pageBuilder.buildAboutPage()
    .then(function(page) {
        deliverPage(response, page);
    });
});
server.get('/:other', function(request, response) {
    response.writeHead(404);
    response.end('404: There\'s nothing here');
});

server.use('/resource', express.static(__dirname + '/../resource'));

function deliverPage(response, page) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(page);
    response.end();
}

pageBuilder.initialise().then(function() {
    server.listen(PORT, function() {
        console.log('Server listening on port:%s', PORT);
    });
});
