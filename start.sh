#!/bin/sh

./node_modules/browserify/bin/cmd.js src/mandelbrot/gui -o src/mandelbrot/bundle.js && 
node src/main.js
