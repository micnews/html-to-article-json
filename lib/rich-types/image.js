'use strict';

var VNode = require('virtual-dom').VNode;

module.exports = function () {
  return {
    category: 'image',
    render: function (obj, alt) {
      return alt
        ? new VNode('IMG', { src: obj.src, alt: alt })
        : new VNode('IMG', { src: obj.src });
    },
    parse: function (elm) {
      var nodeName = elm.nodeName.toLowerCase();

      if (nodeName === 'figure') {
        var img = elm.getElementsByTagName('img')[0];

        if (img) {
          return {
            type: 'rich',
            category: 'image',
            src: img.src,
            caption: null
          };
        }
      } else if (nodeName === 'img') {
        return {
          type: 'rich',
          category: 'image',
          src: elm.src,
          caption: elm.alt ? [{ content: elm.alt, type: 'text' }] : null
        };
      }

      return null;
    }
  };
};
