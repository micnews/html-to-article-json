'use strict';

var generateFunction = require('generate-function');

var renderTextOpts = {
  href: isHref,
  italic: isItalic,
  bold: isBold
};

var createObject = generateFunction();

createObject = createObject('function (opts, elm, renderTextOpts) {')('return {');

Object.keys(renderTextOpts).forEach(function (key) {
  createObject = createObject(
    '  %s: opts[\'%s\'] || renderTextOpts[\'%s\'](elm),',
    key, key, key);
});

createObject = createObject('};')('}');

var f = createObject.toFunction();
module.exports = function (opts, elm) {
  return f(opts, elm, renderTextOpts);
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

function isHref (elm) {
  return (elm.nodeName.toLowerCase() === 'a' && elm.href || null);
}
