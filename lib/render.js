'use strict';

var types = {
  paragraph: paragraph,
  header1: setupHeader('1'),
  header2: setupHeader('2'),
  header3: setupHeader('3'),
  header4: setupHeader('4'),
  header5: setupHeader('5'),
  header6: setupHeader('6'),
  linebreak: linebreak
};

var IncrementalDom = require('incremental-dom');
var elementOpen = IncrementalDom.elementOpen;
var elementClose = IncrementalDom.elementClose;
var elementVoid = IncrementalDom.elementVoid;
var text = IncrementalDom.text;

module.exports = function (data) {
  if (data.size === 0) {
    data = data.set(0, {
      type: 'paragraph',
      children: []
    });
  }

  elementOpen('div', null, ['contenteditable', 'true']);
  data.toJS().forEach(renderNode);
  elementClose('div');
};

function renderNode (obj) {
  return types[obj.type] && types[obj.type](obj);
}

function setupHeader (level) {
  return function (obj) {
    elementOpen('h' + level);
    obj.children.forEach(textNode);
    elementClose('h' + level);
  };
}

function paragraph (obj) {
  elementOpen('p');
  obj.children.forEach(textNode);
  elementClose('p');
}

function linebreak (obj) {
  elementVoid('br');
}

function textNode (textObj) {
  if (textObj.type !== 'text') {
    return;
  }

  if (textObj.bold) {
    elementOpen('b');
  }

  if (textObj.italic) {
    elementOpen('i');
  }

  if (textObj.href) {
    elementOpen('a', '', [ 'href', textObj.href ]);
  }

  text(textObj.content);

  if (textObj.href) {
    elementClose('a');
  }

  if (textObj.italic) {
    elementClose('i');
  }

  if (textObj.bold) {
    elementClose('b');
  }
}
