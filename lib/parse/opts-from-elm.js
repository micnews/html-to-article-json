'use strict';

module.exports = function optsFromElm (opts, elm) {
  var nodeName = elm.nodeName.toLowerCase();

  return {
    bold: opts.bold || isBold(elm),
    italic: opts.italic || isItalic(elm),
    href: opts.href || (nodeName === 'a' && elm.href || null),
    content: null
  };
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
