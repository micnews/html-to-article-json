'use strict';

var test = require('tape');
var jsdom = require('jsdom').jsdom;

var document = global.document = jsdom('<html><body></body></html>');
global.window = document.defaultView;

var render = require('../lib/render');
var collectKeyboardEvents = require('../lib/keyboard-events');
var createElement = require('virtual-dom/create-element');
var dom = require('dom-events');
var Immutable = require('immutable');

test('collectKeyboardEvents() simple keyboard example', function (t) {
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
      content: 'beep boop'
    }, {
      type: 'range-start'
    }, {
      type: 'range-end'
    }]
  }];
  var elm = document.body.appendChild(
    createElement(render(Immutable.fromJS([])))
  );

  var results = data;
  function getData () {
    return results;
  }
  collectKeyboardEvents(elm, getData, function (_results) {
    results = _results;
  });

  'beep boop'.split('').forEach(function (key) {
    dom.emit(elm, 'keypress', {
      key: key
    });
  });

  t.deepEqual(results.toJS(), expected, 'correct results');

  t.end();
});
