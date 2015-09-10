'use strict';

var h = require('virtual-dom/h');
var types = {
  paragraph: paragraph
}

module.exports = function (data) {
  if (data.length === 0) {
    data = [{
      type: 'paragraph'
    }];
  }

  return h('div', { contentEditable: true }, data.map(renderNode));
};

function renderNode (obj) {
  return types[obj.type](obj);
}

function paragraph (obj) {
  return h('p');
}
