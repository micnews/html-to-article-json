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

module.exports = getResult;

function getResult (elm) {
  var result = [];

  parse(elm, extend({
    content: null,
    href: null,
    bold: false,
    italic: false
  }, {}), result);

  return result;
}

function parse (elm, opts, result) {
  // ELEMENT_NODE
  if (elm.nodeType === 1) {
    elementNode(elm, opts, result);
  }

  // TEXT_NODE
  if (elm.nodeType === 3 && elm.nodeValue.length > 0) {
    result.push(
      extend(opts, {
        content: elm.nodeValue
      })
    );
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

function optsFromElm (opts, elm) {
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
}

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

function extend (opts, update) {
  return {
    type: 'text',
    content: update.content || opts.content,
    href: update.href || opts.href,
    bold: update.bold || opts.bold,
    italic: update.italic || opts.italic
  };
}
