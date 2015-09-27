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

module.exports = getResult;

function getResult (elm) {
  var result = [];

  parse(elm, defaultTextNode(), result);

  return result;
}

function parse (elm, opts, result) {
  // ELEMENT_NODE
  if (elm.nodeType === 1) {
    elementNode(elm, opts, result);
  }

  // TEXT_NODE
  if (elm.nodeType === 3 && elm.nodeValue.length > 0) {
    result.push({
      type: 'text',
      italic: opts.italic,
      bold: opts.bold,
      href: opts.href,
      content: elm.nodeValue
    });
  }

  // take next sibling
  if (elm.nextSibling) {
    parse(elm.nextSibling, opts, result);
  }
}

function elementNode (elm, opts, result) {
  var nodeName = elm.nodeName.toLowerCase();
  var isBlockElement = !!BLOCK_ELEMENTS[nodeName];

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
    var blockElement = { type: BLOCK_ELEMENTS[nodeName], children: [] };
    result.push(blockElement);
    if (elm.firstChild) {
      parse(elm.firstChild, optsFromElm(opts, elm), blockElement.children);
    }
    return;
  }

  if (elm.firstChild) {
    parse(elm.firstChild, optsFromElm(opts, elm), result);
  }
}
