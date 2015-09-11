'use strict';

var test = require('tape');
var emptyRange = require('../lib/empty-range');

test('emptyRange()', function (t) {
  var data = [{
    type: 'paragraph',
    children: [
      {
        type: 'text',
        content: 'one'
      }, {
        type: 'range-start'
      }, {
        type: 'text',
        content: 'two'
      }, {
        type: 'range-end'
      }, {
        type: 'text',
        content: 'three'
      }
    ]
  }];
  emptyRange(data);

  t.deepEqual(data, [{
    type: 'paragraph',
    children: [
      {
        type: 'text',
        content: 'one'
      }, {
        type: 'range-start'
      }, {
        type: 'range-end'
      }, {
        type: 'text',
        content: 'three'
      }
    ]
  }]);
  t.end();
});
