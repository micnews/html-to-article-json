'use strict';

var ALLOWED_ATTRIBUTES = require('./allowed-attributes.json');

module.exports = function cleanup (elm) {
  var i;
  var allowed = ALLOWED_ATTRIBUTES[elm.nodeName.toLowerCase()] || [];

  if (elm.nodeType === 1) {
    getAttributeNames(elm).forEach(function (attributeName) {
      if (allowed.indexOf(attributeName) === -1) {
        elm.removeAttribute(attributeName);
      }
    });
    for (i = 0; i < elm.childNodes.length; i++) {
      cleanup(elm.childNodes[i]);
    }
  }
};

function getAttributeNames (elm) {
  var names = ['style'];

  for (var i = 0; i < elm.attributes.length; i++) {
    names.push(elm.attributes[i].name);
  }
  return names;
}
