'use strict';

require('./browser');

var test = require('tape');
var fs = require('fs');
var parseHtml = require('../lib/parse-html');

['basic', 'style', 'divs'].forEach(function (testName) {
  test('parseHtml() ' + testName, function (t) {
    var html = fs.readFileSync(__dirname + '/fixtures/' + testName + '.html');
    var elm = document.createElement('div');
    elm.contentEditable = true;
    elm.innerHTML = html.toString().trim();

    t.deepEqual(parseHtml(elm), require('./fixtures/' + testName + '.json'));

    t.end();
  });
});

test('parseHtml() Multiple text nodes', function (t) {
  var elm = document.body.appendChild(document.createElement('div'));
  elm.appendChild(document.createTextNode('foo'));
  elm.appendChild(document.createTextNode('bar'));

  t.deepEqual(parseHtml(elm), [{
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
