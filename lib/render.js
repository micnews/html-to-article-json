'use strict';

var h = require('virtual-dom/h');
var types = {
  paragraph: paragraph,
  header: header
};

module.exports = function (data) {
  if (data.length === 0) {
    data = [{
      type: 'paragraph',
      children: []
    }];
  }

  return h('div', { contentEditable: true }, data.map(renderNode));
};

function renderNode (obj) {
  return types[obj.type] && types[obj.type](obj);
}

function header (obj) {
  return h('h' + obj.level, obj.children.map(textNode));
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
