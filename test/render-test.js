'use strict';

var render = require('../lib/render');
var test = require('tape');
var toHtml = require('vdom-to-html');

test('render() empty', function (t) {
  t.equal(toHtml(render([])), '<div contenteditable="true"><p></p></div>');
  t.end();
});

test('render() paragraphs & headers', function (t) {
  var paragraph = {
    type: 'paragraph',
    text: [{
      content: 'beepboop'
    }]
  };
  var header1 = {
    type: 'header',
    level: 1,
    text: [{
      content: 'foo'
    }]
  };
  var header2 = {
    type: 'header',
    level: 2,
    text: [{
      content: 'bar'
    }]
  };
  var header3 = {
    type: 'header',
    level: 3,
    text: [{
      content: 'blipblop'
    }]
  };

  t.equal(toHtml(render([paragraph])), expected('<p>beepboop</p>'));
  t.equal(toHtml(render([header1])), expected('<h1>foo</h1>'));
  t.equal(toHtml(render([header2])), expected('<h2>bar</h2>'));
  t.equal(toHtml(render([header3])), expected('<h3>blipblop</h3>'));

  t.end();
});

test('render() text with italic, bold & links', function (t) {
  var html = toHtml(render([{
    type: 'paragraph',
    text: [{
      content: 'foo',
      italic: true
    }, {
      content: 'bar',
      bold: true
    }, {
      content: 'hey'
    }, {
      content: 'blip',
      href: 'http://mic.com'
    }]
  }]));
  var html2 = toHtml(render([{
    type: 'paragraph',
    text: [{
      content: 'yeah',
      italic: true,
      bold: true,
      href: 'http://disney.com'
    }]
  }]));

  t.equal(html, expected(
    '<p>' +
      '<i>foo</i>' +
      '<b>bar</b>' +
      'hey' +
      '<a href="http://mic.com">blip</a>' +
    '</p>'));
  t.equal(html2, expected('<p><b><i><a href="http://disney.com">yeah</a></i></b></p>'));

  t.end();
});

test('render() ignore unkown type(s)', function (t) {
  t.equal(toHtml(render([{
    type: 'beepboop'
  }])), expected(''));

  t.end();
});

function expected (str) {
  return '<div contenteditable="true">' + str + '</div>';
}
