var http = require('http');
var pageBuilder = require('./pageBuilder');
var express = require('express');

var server = express();

var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var IPADDRESS = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
console.log('ip is: ', IPADDRESS);

server.use('/resource', express.static(__dirname + '/../resource'));
server.use('/mandelbrot', express.static(__dirname + '/mandelbrot'));

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
server.get('/about', function(request, response) {
    pageBuilder.buildAboutPage()
    .then(function(page) {
        deliverPage(response, page);
    });
});

server.get('/app/:app', function(request, response) {
    pageBuilder.buildAppPage(request.params.app)
    .then(function(page) {
        deliverPage(response, page);
    });
});

server.get('/:other', function(request, response) {
    response.writeHead(404);
    response.end('404: There\'s nothing here');
});

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
