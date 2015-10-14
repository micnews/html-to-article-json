'use strict';

var setupOptsFromElm = require('./opts-from-elm');
var setupRich = require('../rich-types');

module.exports = function (opts) {
  var rich = setupRich(opts);
  var optsFromElm = setupOptsFromElm(opts);

  return function (elm) {
    var obj;
    for (var i = 0; i < rich.length; i++) {
      obj = rich[i].parse(elm);
      if (obj) {
        if (!obj.caption) {
          var figcaption = elm.getElementsByTagName('figcaption')[0];
          obj.caption = figcaption ? visit([figcaption], [], {}) : [];
        }

        return obj;
      }
    }

    return null;
  };

  function visit (elms, result, opts) {
    for (var i = 0; i < elms.length; i++) {
      var elm = elms[i];

      // ELEMENT_NODE
      if (elm.nodeType === 1) {
        if (elm.childNodes.length) {
          visit(elm.childNodes, result, optsFromElm(opts, elm));
        }
      }

      // TEXT_NODE
      if (elm.nodeType === 3 && elm.nodeValue.length > 0) {
        result.push(optsFromElm(opts, elm));
      }
    }

    return result;
  }
};
