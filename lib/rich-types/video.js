'use strict';

var VNode = require('virtual-dom').VNode;
var arrayFrom = require('array-from');

module.exports = {
  category: 'video',
  render: function (obj, alt) {
    return new VNode('VIDEO', {}, obj.sources.map(function (source) {
      return new VNode('SOURCE', {
        src: source.src || undefined,
        type: source.type || undefined
      });
    }));
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
};
