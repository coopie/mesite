(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var lib = require('./lib');

function $(id) {
    return document.getElementById(id);
}

// TODO: remove it from maincontent

var canvas = $('mandelbrotCanvas');

var ctx = canvas.getContext('2d');
ctx.fillStyle = '#FF0000';
ctx.fillRect(0,0,150,75);

},{"./lib":2}],2:[function(require,module,exports){

function Complex(re, im) {
    this.re = re;
    this.im = im;
}

Complex.prototype.squared = function() {
    this.re = this.re ^ 2 - this.im ^ 2;
    this.im = (this.re * this.im) ^ 2;
    return this;
};

Complex.prototype.plus = function(c) {
    this.re += c.re;
    this.im += c.im;
    return this;
};

var NUMBER_OF_ITERATIONS = 20;

function inMandel(c) {
    var z = new Complex(c.re, c.im);
    for (var i = 0; i < NUMBER_OF_ITERATIONS; i += 1) {
        z = mandelIteration(z, c);
    }
}

// TODO: trace function

function mandelIteration(z, c) {
    return z.squared().plus(c);
}

module.exports = {
    Complex: Complex,
    inMandel: inMandel
};

},{}]},{},[1]);
