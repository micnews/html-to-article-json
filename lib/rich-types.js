'use strict';

var VNode = require('virtual-dom').VNode;

module.exports = function (opts) {
  return [{
    category: 'image',
    render: function (obj, alt) {
      return alt
        ? new VNode('IMG', { src: obj.src, alt: alt })
        : new VNode('IMG', { src: obj.src });
    }
  }];
};
