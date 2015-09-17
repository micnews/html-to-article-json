'use strict';

var blockElements = {
  paragraph: paragraph,
  header1: setupHeader('1'),
  header2: setupHeader('2'),
  header3: setupHeader('3'),
  header4: setupHeader('4'),
  header5: setupHeader('5'),
  header6: setupHeader('6')
};

var inlineElements = {
  linebreak: renderLinebreak,
  text: renderText
};

var IncrementalDom = require('incremental-dom');
var elementOpen = IncrementalDom.elementOpen;
var elementClose = IncrementalDom.elementClose;
var elementVoid = IncrementalDom.elementVoid;
var text = IncrementalDom.text;

module.exports = function (data) {
  if (data.length === 0) {
    data[0] = {
      type: 'paragraph',
      children: [{
        type: 'linebreak'
      }]
    };
  }

  elementOpen('div', null, ['contenteditable', 'true']);
  data.forEach(renderNode);
  elementClose('div');
};

function renderNode (obj) {
  return blockElements[obj.type] && blockElements[obj.type](obj);
}

function setupHeader (level) {
  return function (obj) {
    elementOpen('h' + level);
    obj.children.forEach(renderInline);
    elementClose('h' + level);
  };
}

function paragraph (obj) {
  elementOpen('p');
  obj.children.forEach(renderInline);
  elementClose('p');
}

function renderInline (obj) {
  return inlineElements[obj.type] && inlineElements[obj.type](obj);
}

function renderLinebreak (obj) {
  elementVoid('br');
}

function renderText (obj) {
  if (obj.type !== 'text') {
    return;
  }

  if (obj.bold) {
    elementOpen('b');
  }

  if (obj.italic) {
    elementOpen('i');
  }

  if (obj.href) {
    elementOpen('a', '', [ 'href', obj.href ]);
  }

  text(obj.content);

  if (obj.href) {
    elementClose('a');
  }

  if (obj.italic) {
    elementClose('i');
  }

  if (obj.bold) {
    elementClose('b');
  }
}
