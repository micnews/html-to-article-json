const saveSelection = require('../../src/selection/save');
const restoreSelection = require('../../src/selection/restore');
const test = require('tape');

test('saveSelection() no current selection', function (t) {
  const selection = window.getSelection();
  selection.removeAllRanges();

  const elm = document.body.appendChild(document.createElement('div'));
  elm.contentEditable = 'true';
  elm.setAttribute('contenteditable', 'true');
  elm.innerHTML = '<p>Beep</p>';

  saveSelection(elm);
  t.equal(elm.innerHTML, '<p>Beep</p>', 'unchanged html');

  t.end();
});

test('saveSelection() selection', function (t) {
  const elm = document.body.appendChild(document.createElement('div'));
  const elm2 = document.body.appendChild(document.createElement('div'));
  elm.innerHTML = '<p>Beep</p>';
  const text = elm.querySelector('p').childNodes[0];

  const selection = window.getSelection();
  selection.removeAllRanges();
  const range = document.createRange();
  range.setStart(text, 1);
  range.setEnd(text, 3);
  selection.addRange(range);

  saveSelection(elm2);
  t.equal(elm.innerHTML, '<p>Beep</p>',
    'root doument must include selection');

  saveSelection(elm);
  t.equal(
    elm.innerHTML,
    '<p>B' +
    '<span class="selection-marker-start"></span>' +
    'ee' +
    '<span class="selection-marker-end"></span>p</p>',
    'added selection markers'
  );

  t.end();
});

test('restoreSelection() no markers', function (t) {
  const elm = document.body.appendChild(document.createElement('div'));
  elm.innerHTML = '<p>Beep</p>';
  window.getSelection().removeAllRanges();

  restoreSelection(elm);
  t.equal(window.getSelection().rangeCount, 0, 'No ranges');
  t.end();
});

test('restoreSelection() markers', function (t) {
  const elm = document.body.appendChild(document.createElement('div'));
  elm.innerHTML = '<p>B' +
    '<span class="selection-marker-start"></span>' +
    'ee' +
    '<span class="selection-marker-end"></span>p</p>';

  window.getSelection().removeAllRanges();

  restoreSelection(elm);
  t.equal(window.getSelection().rangeCount, 1, 'One ranges');
  elm.normalize();
  const text = elm.querySelector('p').childNodes[0];
  const range = window.getSelection().getRangeAt(0);
  t.equal(range.startContainer, text, 'range.startContainer');
  t.equal(range.startOffset, 1, 'range.startOffset');
  t.equal(range.endContainer, text, 'range.endContainer');
  t.equal(range.endOffset, 3, 'range.endOffset');
  t.end();
});
