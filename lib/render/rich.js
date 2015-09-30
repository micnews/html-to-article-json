'use strict';

var setupRenderText = require('./render-text');
var VNode = require('virtual-dom').VNode;

module.exports = function (opts) {
  var renderText = setupRenderText(opts);

  return function (obj) {
    if (obj.caption.length === 0) {
      return new VNode('FIGURE', {}, [
        new VNode('IMG', { src: obj.src })
      ]);
    }

    return new VNode('FIGURE', {}, [
      new VNode('IMG', {
        src: obj.src,
        alt: alt(obj)
      }),
      figcaption(obj)
    ]);
  };

  function figcaption (obj) {
    return new VNode('FIGCAPTION', {}, obj.caption.map(renderText));
  }
};

function alt (obj) {
  return obj.caption.map(function (row) {
    return row.content;
  }).join('');
}
