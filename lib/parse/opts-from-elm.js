'use strict';

var extend = require('./extend');

module.exports = function optsFromElm (opts, elm) {
  var nodeName = elm.nodeName.toLowerCase();
  if (isBold(elm)) {
    opts = extend(opts, {
      bold: true
    });
  }
  if (isItalic(elm)) {
    opts = extend(opts, {
      italic: true
    });
  }
  if (nodeName === 'a') {
    opts = extend(opts, {
      href: elm.href
    });
  }
  return opts;
};

function isBold (elm) {
  var fontWeight = elm.style.fontWeight;
  var nodeName = elm.nodeName.toLowerCase();
  return nodeName === 'b' ||
    nodeName === 'strong' ||
    fontWeight === 'bold' ||
    parseInt(fontWeight, 10) >= 700;
}

function isItalic (elm) {
  var nodeName = elm.nodeName.toLowerCase();
  return nodeName === 'i' ||
    nodeName === 'em' ||
    elm.style.fontStyle === 'italic';
}
