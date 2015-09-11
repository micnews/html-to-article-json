'use strict';

var test = require('tape');
var jsdom = require('jsdom').jsdom;

var document = global.document = jsdom('<html><body></body></html>');
global.window = document.defaultView;

var render = require('../lib/render');
var collectKeyboardEvents = require('../lib/keyboard-events');
var createElement = require('virtual-dom/create-element');
var dom = require('dom-events');

test('collectKeyboardEvents() simple keyboard example', function (t) {
  var data = [{
    type: 'paragraph',
    children: [{
      type: 'range-start'
    }, {
      type: 'range-end'
    }]
  }];
  var expected = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beep boop'
    }, {
      type: 'range-start'
    }, {
      type: 'range-end'
    }]
  }];
  var elm = document.body.appendChild(createElement(render([])));

  collectKeyboardEvents(elm, data);

  'beep boop'.split('').forEach(function (key) {
    dom.emit(elm, 'keypress', {
      key: key
    });
  });

  t.deepEqual(data, expected);

  t.end();
});
