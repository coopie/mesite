var http = require('http');
var pageBuilder = require('./pageBuilder');
var express = require('express');
var BlogLogger = require('./blogLogger');

var server = express();
var logger = new BlogLogger();

var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var IPADDRESS = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
console.log('ip is: ', IPADDRESS);

server.get('/', function(request, response) {
    logger.tick('index');
    pageBuilder.buildIndex()
    .then(function(page) {
        deliverPage(response, page);
    });
});
server.get('/posts/:post', function(request, response) {
    logger.tick(request.params.post);
    pageBuilder.buildPost(request.params.post)
    .then(function(page) {
        deliverPage(response, page);
    });
});
server.get('/about', function(request, response) {
    logger.tick('about');
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
    server.listen(PORT, IPADDRESS, function() {
        console.log('Server listening on port:%s', PORT);
    });
});
