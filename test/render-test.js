'use strict';

require('./browser');

var renderToIDom = require('../lib/render');
var test = require('tape');
var patch = require('incremental-dom').patch;

test('render() empty', function (t) {
  t.equal(render([]), expected('<p><br></p>'));
  t.end();
});

test('render() paragraphs & headers', function (t) {
  var paragraph = {
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beepboop'
    }]
  };
  var header1 = {
    type: 'header1',
    children: [{
      type: 'text',
      content: 'foo'
    }]
  };
  var header2 = {
    type: 'header2',
    children: [{
      type: 'text',
      content: 'bar'
    }]
  };
  var header3 = {
    type: 'header3',
    children: [{
      type: 'text',
      content: 'blipblop'
    }]
  };

  t.equal(render([paragraph]), expected('<p>beepboop</p>'));
  t.equal(render([header1]), expected('<h1>foo</h1>'));
  t.equal(render([header2]), expected('<h2>bar</h2>'));
  t.equal(render([header3]), expected('<h3>blipblop</h3>'));

  t.end();
});

test('render() text with italic, bold & links', function (t) {
  var html = render([{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'foo',
      italic: true
    }, {
      type: 'text',
      content: 'bar',
      bold: true
    }, {
      type: 'text',
      content: 'hey'
    }, {
      type: 'text',
      content: 'blip',
      href: 'http://mic.com'
    }]
  }]);
  var html2 = render([{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'yeah',
      italic: true,
      bold: true,
      href: 'http://disney.com'
    }]
  }]);

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
  t.equal(render([{
    type: 'beepboop'
  }]), expected(''));

  t.equal(render([{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beep'
    }, {
      type: 'range-start'
    }, {
      type: 'range-end'
    }, {
      type: 'text',
      content: 'boop'
    }]
  }]), expected('<p>beepboop</p>'));

  t.end();
});

test('render() inline-elements', function (t) {
  t.equal(render([{
    type: 'paragraph',
    children: [{
      type: 'linebreak'
    }]
  }]), expected('<p><br></p>'));
  t.end();
});

function render (list) {
  var elm = document.body.appendChild(document.createElement('div'));
  elm.className = 'wrapper';

  patch(elm, function () {
    renderToIDom(list);
  });
  return elm.outerHTML;
}

function expected (str) {
  return '<div class="wrapper"><div contenteditable="true">' + str + '</div></div>';
}
