'use strict';

require('./mock-jsdom-browser');

var renderToIDom = require('../lib/render')({});
var test = require('tape');
var normalize = require('../lib/normalize')({});

test('render minimum', function (t) {
  t.equal(render(normalize([])), expected('<p><br></p>'));
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
      '<em>foo</em>' +
      '<strong>bar</strong>' +
      'hey' +
      '<a href="http://mic.com">blip</a>' +
    '</p>'));
  t.equal(html2, expected('<p><strong><em><a href="http://disney.com">yeah</a></em></strong></p>'));

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

test('render() selection-marker', function (t) {
  t.equal(render([{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beep'
    }, {
      type: 'selection-marker',
      start: true
    }, {
      type: 'text',
      content: 'boop'
    }, {
      type: 'selection-marker',
      end: true
    }]
  }]),
    expected('<p>' +
      'beep' +
      '<span class="selection-marker-start"></span>' +
      'boop' +
      '<span class="selection-marker-end"></span>' +
      '</p>'
    )
  );
  t.end();
});

test('render() works with bad dom', function (t) {
  var elm = document.createElement('div');
  var input = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beep'
    }]
  }];
  t.equal(render(input, elm), expected('<p>beep</p>'));
  elm.innerHTML = '<p class="huh?">beep</p>';
  t.equal(render(input, elm), expected('<p>beep</p>'));
  elm.innerHTML = '<p foo="bar">beep</p>';
  t.equal(render(input, elm), expected('<p>beep</p>'));
  elm.innerHTML = '<p><i>beep</i></p>';
  t.equal(render(input, elm), expected('<p>beep</p>'));
  elm.innerHTML = '<p>boop</p>';
  t.equal(render(input, elm), expected('<p>beep</p>'));
  elm.innerHTML = '<p>foo</p><p>bar</p>';
  t.equal(render(input, elm), expected('<p>beep</p>'));
  t.end();
});

test('render() works with rich (image)', function (t) {
  var input = [{
    type: 'rich',
    category: 'image',
    src: 'http://example.com/image.jpg',
    caption: []
  }];
  t.equal(
    render(input),
    expected('<figure>' +
      '<img src="http://example.com/image.jpg">' +
      '</figure>'));
  t.end();
});

test('render() works with rich (image + caption)', function (t) {
  var input = [{
    type: 'rich',
    category: 'image',
    caption: [
      { bold: false, content: 'beep', href: null, italic: false, type: 'text' },
      { bold: true, content: 'boop', href: null, italic: false, type: 'text' }
    ],
    src: 'http://example.com/image.jpg'
  }];
  t.equal(
    render(input),
    expected('<figure>' +
      '<img src="http://example.com/image.jpg" alt="beepboop">' +
      '<figcaption>beep<strong>boop</strong></figcaption>' +
      '</figure>'));
  t.end();
});

test('render() persist contenteditable === true', function (t) {
  var div = document.createElement('div');
  div.setAttribute('contenteditable', 'true');
  div.contentEditable = 'true';
  t.equal(render(normalize([]), div),
    '<div contenteditable="true"><p><br></p></div>');
  t.end();
});

test('render() persist contenteditable === false', function (t) {
  var div = document.createElement('div');
  div.setAttribute('contenteditable', 'false');
  div.contentEditable = 'false';
  t.equal(render(normalize([]), div),
    '<div contenteditable="false"><p><br></p></div>');
  t.end();
});

function render (list, elm) {
  elm = elm || document.body.appendChild(document.createElement('div'));

  renderToIDom(elm, list);

  return elm.outerHTML;
}

function expected (str) {
  return '<div>' + str + '</div>';
}
