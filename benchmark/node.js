'use strict';

import setup from '../lib';
import fs from 'fs';

const parse = setup();
const text = fs.readFileSync(__dirname + '/text.html', 'utf8');

const start = Date.now();
let count = 0;
let duration;

for (; count < 1000; ++count) {
  parse(text);
}
duration = Date.now() - start;

const msg = (duration / count) + ' ms / iteration';
console.log(msg);
