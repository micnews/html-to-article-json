'use strict';

var VNode = require('virtual-dom').VNode;
var VText = require('virtual-dom').VText;
var ALLOWED_ATTRIBUTES = require('./allowed-attributes.json');

module.exports = function (elm) {
  return new VNode('DIV', { contentEditable: true }, parse(elm.childNodes));
};

function parse (childNodes) {
  var result = [];
  for (var i = 0; i < childNodes.length; i++) {
    var child = childNodes[i];

    // ELEMENT_NODE
    if (child.nodeType === 1) {
      result.push(
        new VNode(
          child.tagName,
          {
            attributes: getAttributes(child)
          },
          parse(child.childNodes)
        )
      );
    }
    // TEXT_NODE
    if (child.nodeType === 3) {
      result.push(new VText(childNodes[i].nodeValue));
      // result.push(childNodes[i].nodeValue);
    }
  }
  return result;
}

function getAttributes (elm) {
  var obj = {};
  var list = ALLOWED_ATTRIBUTES[elm.nodeName.toLowerCase()];
  if (list) {
    list.forEach(function (attribute) {
      obj[attribute] = elm.getAttribute(attribute);
    });
  }
  return obj;
}
