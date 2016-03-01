
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
