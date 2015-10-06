'use strict';

var VNode = require('virtual-dom').VNode;
var arrayFrom = require('array-from');

module.exports = function (opts) {
  return [{
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
  }, {
    category: 'video',
    render: function (obj, alt) {

    },
    parse: function (elm) {
      var nodeName = elm.nodeName.toLowerCase();

      if (nodeName === 'figure') {
        elm = elm.getElementsByTagName('video')[0];

        if (!elm) {
          return null;
        }

        nodeName = elm.nodeName.toLowerCase();
      }

      if (nodeName === 'video') {
        var sources = elm.getElementsByTagName('source');

        if (sources.length) {
          return {
            type: 'rich',
            category: 'video',
            sources: arrayFrom(sources).map(function (sourceElm) {
              return {
                src: sourceElm.src,
                type: sourceElm.type || null
              };
            })
          };
        }

        return {
          type: 'rich',
          category: 'video',
          sources: [{
            src: elm.src,
            type: null
          }],
          caption: null
        };
      }

      return null;
    }
  }];
};
