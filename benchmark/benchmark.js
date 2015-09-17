'use strict';

require('../test/browser');

var prettyHrtime = require('pretty-hrtime');

var update = require('../');
var fs = require('fs');
var text = document.createElement('div');
text.innerHTML = fs.readFileSync(__dirname + '/text.html', 'utf8');

var start = process.hrtime();

for (var i = 0; i < 1000; ++i) {
  update(text);
}

console.log(`duration: ${prettyHrtime(process.hrtime(start))} (1000 iterations)`);
