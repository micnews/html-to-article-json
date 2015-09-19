'use strict';

var normalize = require('../lib/parse/normalize');
var test = require('tape');

test('normalize() minimum content', function (t) {
  var expected = [{
    type: 'paragraph',
    children: [{
      type: 'linebreak'
    }]
  }];

  t.deepEqual(normalize([]), expected);
  t.deepEqual(normalize([{ type: 'paragraph', children: [] }]), expected);
  t.deepEqual(normalize(normalize([])), expected);

  t.end();
});

test('normalize() minimum content with selection markers', function (t) {
  var input = [{
    type: 'paragraph',
    children: [
      {
        type: 'selection-marker',
        start: true
      }, {
        type: 'selection-marker',
        end: true
      }
    ]
  }];
  var expected = [{
    type: 'paragraph',
    children: [
      {
        type: 'linebreak'
      }, {
        type: 'selection-marker',
        start: true
      }, {
        type: 'selection-marker',
        end: true
      }
    ]
  }];

  t.deepEqual(normalize(input), expected);

  t.end();
});
