'use strict';

var test = require('tape');
var Immutable = require('immutable');
var addChar = require('../lib/add-char');

test('addChar() add single', function (t) {
  var data = Immutable.fromJS([{
    type: 'paragraph',
    children: [{
      type: 'range-start'
    }, {
      type: 'range-end'
    }]
  }]);
  var expected = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'a'
    }, {
      type: 'range-start'
    }, {
      type: 'range-end'
    }]
  }];
  var actual = addChar(data, 'a');
  t.deepEqual(actual.toJS(), expected);
  t.end();
});

test('addChar() add to existing', function (t) {
  var data = Immutable.fromJS([{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'a'
    }, {
      type: 'range-start'
    }, {
      type: 'range-end'
    }]
  }]);
  var expected = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'ab'
    }, {
      type: 'range-start'
    }, {
      type: 'range-end'
    }]
  }];
  var actual = addChar(data, 'b');
  t.deepEqual(actual.toJS(), expected);
  t.end();
});
