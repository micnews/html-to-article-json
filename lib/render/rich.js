'use strict';

var h = require('virtual-dom/h');
var renderText = require('./render-text');

module.exports = function (obj) {
  return h('figure', [
    h('img', {
      src: obj.src,
      alt: alt(obj)
    }),
    figcaption(obj)
  ]);
};

function alt (obj) {
  if (obj.caption.length === 0) {
    return undefined;
  }

  return obj.caption.map(function (row) {
    return row.content;
  }).join('');
}

function figcaption (obj) {
  if (obj.caption.length === 0) {
    return undefined;
  }

  return h('figcaption', obj.caption.map(renderText));
}
