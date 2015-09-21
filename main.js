
var http = require('http');
var url = require('url');
var dispatch = require('dispatch');

var PORT = 8080;

var dispatcher = dispatch({
    '/': function(request, response) {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('wabalubbadubdub');
    },
    '/about': function(request, response) {
        response.end('wabalubbadubdub is like cool');
    },
    '/user/:id': function(request, response, id) {
        response.end(id + ' I know right');
    },
    '/posts/:post': function(request, response, post) {
        response.end('posterino number ' + post);
    },
    '/:other': function(request, response) {
        response.writeHead(404);
        response.end('this is not the page you are looking for');
    }
});

var server = http.createServer(function(request, response) {
    try {
        dispatcher(request, response);
    } catch (err) {
        console.error(err);
        response.writeHead(500);
        response.end('Internal Server Error');
    }
});

server.listen(PORT, function() {
    console.log('Server listening on: http://localhost:%s', PORT);
});
