'use strict';

require('./browser');

var test = require('tape');
var parse = require('../lib/parse');

test('parse() single block element node', function (t) {
  var elm = document.createElement('p');
  t.deepEqual(parse(elm), [{ type: 'paragraph', children: [] }]);
  t.end();
});

test('parse() single inline element node', function (t) {
  var elm = document.createElement('span');
  t.deepEqual(parse(elm), []);
  t.end();
});

test('parse() img, with alt-attribute', function (t) {
  var img = document.createElement('img');
  img.src = 'http://example.com/image.jpg';
  t.deepEqual(parse(img), [{
    type: 'rich',
    category: 'image',
    caption: [],
    src: 'http://example.com/image.jpg'
  }]);
  t.end();
});

test('parse() img, with alt-attribute', function (t) {
  var img = document.createElement('img');
  img.src = 'http://example.com/image.jpg';
  img.alt = 'beep boop';
  t.deepEqual(parse(img), [{
    type: 'rich',
    category: 'image',
    caption: [
      { bold: false, content: 'beep boop', href: null, italic: false, type: 'text' }
    ],
    src: 'http://example.com/image.jpg'
  }]);
  t.end();
});

test('parse() figure + img', function (t) {
  var figure = document.createElement('figure');
  var img = figure.appendChild(document.createElement('img'));
  img.src = 'http://example.com/image.jpg';
  var figcaption = figure.appendChild(document.createElement('figcaption'));
  var b = document.createElement('b');
  b.appendChild(document.createTextNode('world'));
  figcaption.appendChild(document.createTextNode('Hello, '));
  figcaption.appendChild(b);
  t.deepEqual(parse(figure), [{
    type: 'rich',
    category: 'image',
    caption: [
      { bold: false, content: 'Hello, ', href: null, italic: false, type: 'text' },
      { bold: true, content: 'world', href: null, italic: false, type: 'text' }
    ],
    src: 'http://example.com/image.jpg'
  }]);
  t.end();
});

test('parse() figure + img but no figcaption', function (t) {
  var figure = document.createElement('figure');
  var img = figure.appendChild(document.createElement('img'));
  img.src = 'http://example.com/image.jpg';
  t.deepEqual(parse(figure), [{
    type: 'rich',
    category: 'image',
    caption: [],
    src: 'http://example.com/image.jpg'
  }]);
  t.end();
});

test('parse() figure with unkown content', function (t) {
  var figure = document.createElement('figure');
  t.deepEqual(parse(figure), []);
  t.end();
});

test('parse() figure + img and figcaption with no content', function (t) {
  var figure = document.createElement('figure');
  var img = figure.appendChild(document.createElement('img'));
  img.src = 'http://example.com/image.jpg';
  figure.appendChild(document.createElement('figcaption'));
  t.deepEqual(parse(figure), [{
    type: 'rich',
    category: 'image',
    caption: [],
    src: 'http://example.com/image.jpg'
  }]);
  t.end();
});
