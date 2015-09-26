'use strict';

var BLOCK_ELEMENTS = {
  h1: 'header1',
  h2: 'header2',
  h3: 'header3',
  h4: 'header4',
  h5: 'header5',
  h6: 'header6',
  p: 'paragraph',
  div: 'div'
};

var rich = require('./rich');
var defaultTextNode = require('./default-text-node');
var optsFromElm = require('./opts-from-elm');

module.exports = function (opts) {
  return function getResult (elm) {
    var result = [];

    parse(elm, opts, defaultTextNode(), result);

    return result;
  };
};

function parse (elm, opts, textOpts, result) {
  // ELEMENT_NODE
  if (elm.nodeType === 1) {
    elementNode(elm, opts, textOpts, result);
  }

  // TEXT_NODE
  if (elm.nodeType === 3 && elm.nodeValue.length > 0) {
    result.push({
      type: 'text',
      italic: textOpts.italic,
      bold: textOpts.bold,
      href: textOpts.href,
      content: elm.nodeValue
    });
  }

  // take next sibling
  if (elm.nextSibling) {
    parse(elm.nextSibling, opts, textOpts, result);
  }
}

function elementNode (elm, opts, textOpts, result) {
  var nodeName = elm.nodeName.toLowerCase();
  var isBlockElement = !!BLOCK_ELEMENTS[nodeName] || customParse(opts, elm);

  if (nodeName === 'br') {
    result.push({ type: 'linebreak' });
    return;
  }

  if (nodeName === 'span') {
    if (elm.className === 'selection-marker-start') {
      result.push({ type: 'selection-marker', start: true });
      return;
    }

    if (elm.className === 'selection-marker-end') {
      result.push({ type: 'selection-marker', end: true });
      return;
    }
  }

  if (nodeName === 'figure') {
    var richResult = rich(nodeName, elm);
    if (richResult) {
      result.push(richResult);
    }
    return;
  }

  if (nodeName === 'img') {
    result.push(rich(nodeName, elm));
    return;
  }

  if (isBlockElement) {
    var blockElement = {
      type: customParse(opts, elm) || BLOCK_ELEMENTS[nodeName],
      children: []
    };
    result.push(blockElement);
    if (elm.firstChild) {
      parse(elm.firstChild, opts, optsFromElm(textOpts, elm), blockElement.children);
    }
    return;
  }

  if (elm.firstChild) {
    parse(elm.firstChild, opts, optsFromElm(textOpts, elm), result);
  }
}

function customParse (opts, elm) {
  return opts.custom && opts.custom.parse && opts.custom.parse(elm);
}
