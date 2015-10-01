'use strict';

require('./mock-jsdom-browser');

var test = require('tape');
var init = require('../');
var updateWithoutSelection = init({
  saveSelection: false
});
var updateWithSelection = init({
  saveSelection: true
});

test('init() required opts', function (t) {
  t.throws(function () {
    init();
  }, 'init() must have opts');
  t.throws(function () {
    init({});
  }, 'init() must have opts.saveSelection');
  t.throws(function () {
    init({
      saveSelection: null
    });
  }, 'init() must have opts.saveSelection that is a boolean');
  t.end();
});

test('init({ saveSelection: false }) text', function (t) {
  var elm;
  var child;
  var child2;
  elm = document.body.appendChild(document.createElement('div'));
  elm.appendChild(document.createTextNode('beep'));
  updateWithoutSelection(elm);
  t.equal(elm.innerHTML, '<p>beep</p>', 'wrap text in p-tag');

  elm.innerHTML = '';
  child = elm.appendChild(document.createElement('p'));
  child.className = 'foo';
  child.appendChild(document.createTextNode('beep'));
  updateWithoutSelection(elm);
  t.equal(elm.innerHTML, '<p>beep</p>', 'previous dom with class');
  t.equal(elm.childNodes[0], child, 'reused existing node');

  elm.innerHTML = '';
  child = elm.appendChild(document.createElement('p'));
  child.setAttribute('foo', 'bar');
  child.setAttribute('style', 'font-size: 10px');
  child.appendChild(document.createTextNode('beep'));
  updateWithoutSelection(elm);
  t.equal(elm.innerHTML, '<p>beep</p>', 'previous dom with attribute');
  t.equal(elm.childNodes[0], child, 'reused existing node');

  elm.innerHTML = '';
  child = elm.appendChild(document.createElement('p'));
  child.appendChild(document.createTextNode('boop'));
  updateWithoutSelection(elm);
  child2 = elm.insertBefore(document.createElement('p'), elm.firstChild);
  child2.appendChild(document.createTextNode('beep'));
  updateWithoutSelection(elm);
  t.equal(elm.innerHTML, '<p>beep</p><p>boop</p>', 'prepend element');
  t.equal(elm.childNodes[1], child, 'only required node has been created');

  t.end();
});

test('init({ saveSelection: false }) custom attributes on root div', function (t) {
  var elm = document.body.appendChild(document.createElement('div'));
  elm.setAttribute('foo', 'bar');

  updateWithoutSelection(elm);
  t.equal(elm.getAttribute('foo'), 'bar', 'custom attribute is kept');
  t.end();
});

test('init({ saveSelection: false }) img', function (t) {
  var elm = document.body.appendChild(document.createElement('div'));
  var img = elm.appendChild(document.createElement('img'));
  img.setAttribute('src', 'http://example.com/image.jpg');
  updateWithoutSelection(elm);
  t.equal(elm.innerHTML, '<figure><img src="http://example.com/image.jpg"></figure>');
  t.end();
});

test('init({ saveSelection: false }) figure + img with figcaption', function (t) {
  var elm = document.body.appendChild(document.createElement('div'));
  elm.innerHTML = '<figure>' +
      '<img src="http://example.com/image.jpg">' +
      '<figcaption><b>Beep</b>peeB</figcaption>' +
    '</figure>';
  updateWithoutSelection(elm);
  var expected = '<figure>' +
      '<img src="http://example.com/image.jpg" alt="BeeppeeB">' +
      '<figcaption><strong>Beep</strong>peeB</figcaption>' +
    '</figure>';
  t.equal(elm.innerHTML, expected);
  t.end();
});

if (process.browser) {
  test('init({ saveSelection: true }) with selection (default)', function (t) {
    var elm = document.body.appendChild(document.createElement('div'));
    elm.innerHTML = '<p>Beep</p>';
    var text = elm.querySelector('p').childNodes[0];

    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.setStart(text, 1);
    range.setEnd(text, 3);
    selection.addRange(range);

    updateWithSelection(elm);
    elm.normalize();

    var range2 = window.getSelection().getRangeAt(0);
    t.notEqual(range, range2, 'different than the start rante');
    t.equal(range2.startContainer, text, 'range2.startContainer');
    t.equal(range2.startOffset, 1, 'range2.startOffset');
    t.equal(range2.endContainer, text, 'range2.endContainer');
    t.equal(range2.endOffset, 3, 'range2.endOffset');
    t.end();
  });
}
