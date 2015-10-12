'use strict';

require('./utils/mock-jsdom-browser');

var test = require('tape');
var fs = require('fs');
var parseAndNormalize = require('../')({ saveSelection: false }).parse;

createTest(
  'basic',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/basic.html', 'utf8'),
  require('./parse-normalize-fixtures/basic.json')
);
createTest(
  'inline-css',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/inline-css.html', 'utf8'),
  require('./parse-normalize-fixtures/inline-css.json')
);
createTest(
  'blocks',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/blocks.html', 'utf8'),
  require('./parse-normalize-fixtures/blocks.json')
);
createTest(
  'whitespace',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/whitespace.html', 'utf8'),
  require('./parse-normalize-fixtures/whitespace.json')
);
createTest(
  'linebreak',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/linebreak.html', 'utf8'),
  require('./parse-normalize-fixtures/linebreak.json')
);
createTest(
  'selection-marker',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/selection-marker.html', 'utf8'),
  require('./parse-normalize-fixtures/selection-marker.json')
);
createTest(
  'head-elements',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/head-elements.html', 'utf8'),
  require('./parse-normalize-fixtures/head-elements.json')
);

function createTest (testName, html, expected) {
  test('parseAndNormalize(elm)) ' + testName, function (t) {
    var elm = document.createElement('div');
    elm.contentEditable = true;
    elm.innerHTML = html.trim();

    t.deepEqual(parseAndNormalize(elm), expected);

    t.end();
  });
}

test('parseAndNormalize(elm)) whitespace \t', function (t) {
  var elm = document.body.appendChild(document.createElement('p'));
  elm.appendChild(document.createTextNode('\tbeep\tboop\t'));
  t.deepEqual(parseAndNormalize(elm), [{
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

test('parseAndNormalize(elm)) Multiple text nodes', function (t) {
  var elm = document.body.appendChild(document.createElement('div'));
  'foobar'.split('').forEach(function (char) {
    elm.appendChild(document.createTextNode(char));
  });

  t.deepEqual(parseAndNormalize(elm), [{
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

test('parseAndNormalize(elm)) empty text node', function (t) {
  var elm = document.body.appendChild(document.createElement('div'));
  var p = elm.appendChild(document.createElement('p'));
  p.appendChild(document.createTextNode(''));

  t.deepEqual(parseAndNormalize(elm), [{
    type: 'paragraph',
    children: [{
      type: 'linebreak'
    }]
  }]);
  t.end();
});
