'use strict';

var setupOptsFromElm = require('./opts-from-elm');

module.exports = function (opts) {
  var optsFromElm = setupOptsFromElm(opts);

  return function rich (nodeName, elm) {
    if (nodeName === 'figure') {
      var img = elm.getElementsByTagName('img')[0];
      var figcaption = elm.getElementsByTagName('figcaption')[0];

      if (img) {
        return {
          type: 'rich',
          category: 'image',
          src: img.src,
          caption: figcaption ? visit(figcaption, [], {}) : []
        };
      }
      return null;
    }

    var caption = [];
    if (elm.alt) {
      caption.push({
        content: elm.alt,
        type: 'text'
      });
    }
    return {
      type: 'rich',
      category: 'image',
      src: elm.src,
      caption: caption
    };
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
      result.push(optsFromElm(opts, elm));
    }

    if (elm.nextSibling) {
      visit(elm.nextSibling, result, opts);
    }

    return result;
  }
};
