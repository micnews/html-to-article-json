'use strict';

require('./browser');

var test = require('tape');
var _update = require('../');

test('update()', function (t) {
  var elm;
  var child;
  var child2;
  elm = document.body.appendChild(document.createElement('div'));
  elm.getAttribute('contenteditable', 'true');
  elm.appendChild(document.createTextNode('beep'));
  update(elm);
  t.equal(elm.innerHTML, '<p>beep</p>', 'wrap text in p-tag');

  elm.innerHTML = '';
  child = elm.appendChild(document.createElement('p'));
  child.className = 'foo';
  child.appendChild(document.createTextNode('beep'));
  update(elm);
  t.equal(elm.innerHTML, '<p>beep</p>', 'previous dom with class');
  t.equal(elm.childNodes[0], child, 'reused existing node');

  elm.innerHTML = '';
  child = elm.appendChild(document.createElement('p'));
  child.setAttribute('foo', 'bar');
  child.setAttribute('style', 'font-size: 10px');
  child.appendChild(document.createTextNode('beep'));
  update(elm);
  t.equal(elm.innerHTML, '<p>beep</p>', 'previous dom with attribute');
  t.equal(elm.childNodes[0], child, 'reused existing node');

  elm.innerHTML = '';
  child = elm.appendChild(document.createElement('p'));
  child.appendChild(document.createTextNode('boop'));
  update(elm);
  child2 = elm.insertBefore(document.createElement('p'), elm.firstChild);
  child2.appendChild(document.createTextNode('beep'));
  update(elm);
  t.equal(elm.innerHTML, '<p>beep</p><p>boop</p>', 'prepend element');
  t.equal(elm.childNodes[1], child, 'only required node has been created');

  t.end();
});

test('update() custom attributes on root div', function (t) {
  var elm = document.body.appendChild(document.createElement('div'));
  elm.setAttribute('foo', 'bar');

  update(elm);
  t.notEqual(elm.getAttribute('foo'), 'bar');
  t.equal(elm.contentEditable, 'true');
  t.end();
});

function update (elm) {
  _update(elm, { saveSelection: false });
}
