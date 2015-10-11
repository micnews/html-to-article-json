'use strict';

require('../test/utils/mock-jsdom-browser');

var update = require('../')({
  saveSelection: false
});
var fs = require('fs');
var text = document.createElement('div');
text.innerHTML = fs.readFileSync(__dirname + '/text.html', 'utf8');

var start = Date.now();
var count = 0;
var duration;

for (count = 0; count < 1000; ++count) {
  update(text);
}
duration = Date.now() - start;

var msg = (duration / count) + ' ms / iteration';
console.log(msg);
document.body.appendChild(document.createTextNode(msg));
