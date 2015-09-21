'use strict';

var h = require('virtual-dom/h');

module.exports = function (obj) {
  return h('figure', [
    h('img', {
      src: obj.src,
      alt: obj.caption
    }),
    obj.caption ? h('figcaption', obj.caption) : null
  ]);
};
