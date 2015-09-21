'use strict';

var ALLOWED_ATTRIBUTES = {
  contenteditable: true,
  class: true,
  href: true
};

module.exports = function cleanup (elm) {
  var i;
  if (elm.nodeType === 1) {
    for (i = 0; i < elm.attributes.length; i++) {
      if (!ALLOWED_ATTRIBUTES[elm.attributes[i].name]) {
        elm.removeAttribute(elm.attributes[i].name);
      }
    }
    elm.removeAttribute('style');
    for (i = 0; i < elm.childNodes.length; i++) {
      cleanup(elm.childNodes[i]);
    }
  }
};
