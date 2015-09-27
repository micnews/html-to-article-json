'use strict';

require('./mock-jsdom-browser');

var test = require('tape');
var fs = require('fs');
var parse = require('../lib/parse');
var normalize = require('../lib/normalize');

createTest(
  'basic',
  fs.readFileSync(__dirname + '/fixtures/basic.html', 'utf8'),
  require('./fixtures/basic.json')
);
createTest(
  'style',
  fs.readFileSync(__dirname + '/fixtures/style.html', 'utf8'),
  require('./fixtures/style.json')
);
createTest(
  'divs',
  fs.readFileSync(__dirname + '/fixtures/divs.html', 'utf8'),
  require('./fixtures/divs.json')
);
createTest(
  'whitespace',
  fs.readFileSync(__dirname + '/fixtures/whitespace.html', 'utf8'),
  require('./fixtures/whitespace.json')
);
createTest(
  'linebreak',
  fs.readFileSync(__dirname + '/fixtures/linebreak.html', 'utf8'),
  require('./fixtures/linebreak.json')
);
createTest(
  'selection-marker',
  fs.readFileSync(__dirname + '/fixtures/selection-marker.html', 'utf8'),
  require('./fixtures/selection-marker.json')
);

function createTest (testName, html, expected) {
  test('normalize(parse(elm)) ' + testName, function (t) {
    var elm = document.createElement('div');
    elm.contentEditable = true;
    elm.innerHTML = html.trim();

    t.deepEqual(normalize(parse(elm)), expected);

    t.end();
  });
}

test('normalize(parse(elm)) whitespace \t', function (t) {
  var elm = document.body.appendChild(document.createElement('p'));
  elm.appendChild(document.createTextNode('\tbeep\tboop\t'));
  t.deepEqual(normalize(parse(elm)), [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: ' beep boop ',
      href: null,
      bold: false,
      italic: false
    }]
  }]);
  t.end();
});

test('normalize(parse(elm)) Multiple text nodes', function (t) {
  var elm = document.body.appendChild(document.createElement('div'));
  'foobar'.split('').forEach(function (char) {
    elm.appendChild(document.createTextNode(char));
  });

  t.deepEqual(normalize(parse(elm)), [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'foobar',
      href: null,
      bold: false,
      italic: false
    }]
  }]);
  t.end();
});

test('normalize(parse(elm)) empty text node', function (t) {
  var elm = document.body.appendChild(document.createElement('div'));
  var p = elm.appendChild(document.createElement('p'));
  p.appendChild(document.createTextNode(''));

  t.deepEqual(normalize(parse(elm)), [{
    type: 'paragraph',
    children: [{
      type: 'linebreak'
    }]
  }]);
  t.end();
});
