'use strict';

var test = require('tape');
var setupParse = require('../src/parse');

var parse = setupParse({});

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

test('parse() text in span', function (t) {
  var elm = document.createElement('span');
  elm.innerHTML = 'beep boop';
  t.deepEqual(parse(elm), [{
    bold: false,
    content: 'beep boop',
    href: null,
    italic: false,
    type: 'text'
  }]);
  t.end();
});

test('parse() img', function (t) {
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
      { content: 'beep boop', type: 'text' }
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
  t.deepEqual(parse(figure), [{
    type: 'block',
    children: []
  }]);
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

test('parse() video with src', function (t) {
  var video = document.createElement('video');
  video.src = 'http://example.com/video.mp4';
  t.deepEqual(parse(video), [{
    type: 'rich',
    category: 'video',
    caption: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }]
  }]);
  t.end();
});

test('parse() video with sources', function (t) {
  var video = document.createElement('video');
  var source1 = video.appendChild(document.createElement('source'));
  source1.src = 'http://example.com/video.mp4';
  var source2 = video.appendChild(document.createElement('source'));
  source2.src = 'http://example.com/video2.mp4';
  source2.type = 'video/mp4';
  t.deepEqual(parse(video), [{
    type: 'rich',
    category: 'video',
    caption: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }, {
      src: 'http://example.com/video2.mp4',
      type: 'video/mp4'
    }]
  }]);
  t.end();
});

test('parse() figure + video with src', function (t) {
  var figure = document.createElement('figure');
  var video = figure.appendChild(document.createElement('video'));
  video.src = 'http://example.com/video.mp4';
  t.deepEqual(parse(figure), [{
    type: 'rich',
    category: 'video',
    caption: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }]
  }]);
  t.end();
});

test('parse() figure + video with sources', function (t) {
  var figure = document.createElement('figure');
  var video = figure.appendChild(document.createElement('video'));
  var source1 = video.appendChild(document.createElement('source'));
  source1.src = 'http://example.com/video.mp4';
  var source2 = video.appendChild(document.createElement('source'));
  source2.src = 'http://example.com/video2.mp4';
  source2.type = 'video/mp4';
  t.deepEqual(parse(figure), [{
    type: 'rich',
    category: 'video',
    caption: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }, {
      src: 'http://example.com/video2.mp4',
      type: 'video/mp4'
    }]
  }]);
  t.end();
});

test('parse() figure + video with src & figcaption', function (t) {
  var figure = document.createElement('figure');
  var video = figure.appendChild(document.createElement('video'));
  var figcaption = figure.appendChild(document.createElement('figcaption'));
  var b = document.createElement('b');
  b.appendChild(document.createTextNode('world'));
  figcaption.appendChild(document.createTextNode('Hello, '));
  figcaption.appendChild(b);
  video.src = 'http://example.com/video.mp4';
  t.deepEqual(parse(figure), [{
    type: 'rich',
    category: 'video',
    caption: [
      { bold: false, content: 'Hello, ', href: null, italic: false, type: 'text' },
      { bold: true, content: 'world', href: null, italic: false, type: 'text' }
    ],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }]
  }]);
  t.end();
});
