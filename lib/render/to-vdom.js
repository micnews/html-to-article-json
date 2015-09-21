'use strict';

var h = require('virtual-dom/h');
var ALLOWED_ATTRIBUTES = Object.keys(require('./allowed-attributes.json'));

module.exports = function (elm) {
  return h('div', { contentEditable: true }, parse(elm.childNodes));
};

function parse (childNodes) {
  var result = [];
  for (var i = 0; i < childNodes.length; i++) {
    var child = childNodes[i];
    var opts = {};
    if (child.className) {
      opts.className = child.className;
    }
    if (child.href) {
      opts.href = child.href;
    }

    // ELEMENT_NODE
    if (child.nodeType === 1) {
      result.push(
        h(
          child.tagName.toLowerCase(),
          {
            attributes: getAttributes(child)
          },
          parse(child.childNodes)
        )
      );
    }
    // TEXT_NODE
    if (child.nodeType === 3) {
      result.push(childNodes[i].nodeValue);
    }
  }
  return result;
}

function getAttributes (elm) {
  var obj = {};
  ALLOWED_ATTRIBUTES.forEach(function (attribute) {
    obj[attribute] = elm.getAttribute(attribute);
  });
  return obj;
}
