'use strict';

var render = require('../lib/render');
var test = require('tape');
var toHtml = require('vdom-to-html');

test('render() empty', function (t) {
  t.equal(toHtml(render([])), '<div contenteditable="true"><p></p></div>');
  t.end();
});
