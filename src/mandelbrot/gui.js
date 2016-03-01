var lib = require('./lib');

function $(id) {
    return document.getElementById(id);
}

// TODO: remove it from maincontent

var canvas = $('mandelbrotCanvas');

var ctx = canvas.getContext('2d');
ctx.fillStyle = '#FF0000';
ctx.fillRect(0,0,150,75);
