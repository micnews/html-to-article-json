'use strict';

var test = require('tape');
var emptyRange = require('../lib/empty-range');
var Immutable = require('immutable');

test('emptyRange()', function (t) {
  t.deepEqual(emptyRange(Immutable.fromJS([{
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
  }])).toJS(), [{
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

  t.deepEqual(emptyRange(Immutable.fromJS([
    {
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
        }
      ]
    }, {
      type: 'paragraph',
      children: [{
        type: 'text',
        content: 'three'
      }]
    }, {
      type: 'header',
      level: 1,
      children: [
        {
          type: 'text',
          content: 'four'
        }, {
          type: 'range-end'
        }, {
          type: 'text',
          content: 'five'
        }
      ]
    }
  ])).toJS(), [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          content: 'one'
        }, {
          type: 'range-start'
        }
      ]
    },
    {
      type: 'header',
      level: 1,
      children: [
        {
          type: 'range-end'
        }, {
          type: 'text',
          content: 'five'
        }
      ]
    }
  ]);

  t.end();
});
