'use strict';

require('./browser');

var test = require('tape');
var parse = require('../lib/parse');

test('parse() single block element node', function (t) {
  var elm = document.createElement('p');
  t.deepEqual(parse(elm), [{ type: 'paragraph', children: [] }]);
  t.end();
});

test('parse() single inline element node', function (t) {
  var elm = document.createElement('span');
  t.deepEqual(parse(elm), []);
  t.end();
});
