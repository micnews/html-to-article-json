'use strict';

var h = require('virtual-dom/h');

module.exports = function renderText (obj, elm) {
  var child = obj.content;

  if (obj.href) {
    child = h('a', { href: obj.href }, child);
  }

  if (obj.italic) {
    child = h('em', child);
  }

  if (obj.bold) {
    child = h('strong', child);
  }

  return child;
};
