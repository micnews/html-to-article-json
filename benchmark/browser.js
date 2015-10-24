'use strict';

const update = require('../src/index')({
  saveSelection: false
});
const fs = require('fs');
const text = document.createElement('div');
text.innerHTML = fs.readFileSync(__dirname + '/text.html', 'utf8');

const start = Date.now();
let count = 0;
let duration;

for (; count < 1000; ++count) {
  update(text);
}
duration = Date.now() - start;

const msg = (duration / count) + ' ms / iteration';
console.log(msg);
document.body.appendChild(document.createTextNode(msg));
