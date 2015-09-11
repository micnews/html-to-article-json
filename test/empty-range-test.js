'use strict';

var test = require('tape');
var emptyRange = require('../lib/empty-range');

test('emptyRange()', function (t) {
  t.deepEqual(emptyRange([{
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
  }]), [{
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

  t.deepEqual(emptyRange([
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
    },
    {
      type: 'header',
      level: 1,
      children: [
        {
          type: 'text',
          content: 'three'
        }, {
          type: 'range-end'
        }, {
          type: 'text',
          content: 'four'
        }
      ]
    }
  ]), [
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
          content: 'four'
        }
      ]
    }
  ]);

  t.end();
});
