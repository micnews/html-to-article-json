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
      text: []
    }];
  }

  return h('div', { contentEditable: true }, data.map(renderNode));
};

function renderNode (obj) {
  return types[obj.type](obj);
}

function header (obj) {
  return h('h' + obj.level, obj.text.map(textNode));
}

function paragraph (obj) {
  return h('p', obj.text.map(textNode));
}

function textNode (text) {
  return text.content;
}
