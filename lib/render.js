'use strict';

var h = require('virtual-dom/h');
var types = {
  paragraph: paragraph,
  header1: setupHeader('1'),
  header2: setupHeader('2'),
  header3: setupHeader('3'),
  header4: setupHeader('4'),
  header5: setupHeader('5'),
  header6: setupHeader('6')
};

module.exports = function (data) {
  if (data.size === 0) {
    data = data.set(0, {
      type: 'paragraph',
      children: []
    });
  }

  return h('div', { contentEditable: true }, data.toJS().map(renderNode));
};

function renderNode (obj) {
  return types[obj.type] && types[obj.type](obj);
}

function setupHeader (level) {
  return function (obj) {
    return h('h' + level, obj.children.map(textNode));
  };
}

function paragraph (obj) {
  return h('p', obj.children.map(textNode));
}

function textNode (text) {
  var content = text.content;

  if (text.href) {
    content = h('a', { href: text.href }, content);
  }

  if (text.italic) {
    content = h('i', content);
  }

  if (text.bold) {
    content = h('b', content);
  }

  return content;
}
