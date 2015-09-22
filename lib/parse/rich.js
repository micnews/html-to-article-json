'use strict';

var extend = require('./extend');
var defaultTextNode = require('./default-text-node');
var optsFromElm = require('./opts-from-elm');

module.exports = function rich (nodeName, elm) {
  if (nodeName === 'figure') {
    return {
      type: 'rich',
      category: 'image',
      src: elm.getElementsByTagName('img')[0].src,
      caption: visit(elm.getElementsByTagName('figcaption')[0], [], defaultTextNode())
    };
  }

  if (nodeName === 'img') {
    var caption = [];
    if (elm.alt) {
      caption.push({
        content: elm.alt,
        bold: false,
        href: null,
        italic: false,
        type: 'text'
      });
    }
    return {
      type: 'rich',
      category: 'image',
      src: elm.src,
      caption: caption
    };
  }
};

function visit (elm, result, opts) {
  // ELEMENT_NODE
  if (elm.nodeType === 1) {
    if (elm.firstChild) {
      visit(elm.firstChild, result, optsFromElm(opts, elm));
    }
  }

  // TEXT_NODE
  if (elm.nodeType === 3 && elm.nodeValue.length > 0) {
    result.push(
      extend(opts, {
        content: elm.nodeValue
      })
    );
  }

  if (elm.nextSibling) {
    visit(elm.nextSibling, result, opts);
  }

  return result;
}
