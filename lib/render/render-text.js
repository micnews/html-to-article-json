'use strict';

var VNode = require('virtual-dom').VNode;
var VText = require('virtual-dom').VText;

module.exports = function renderText (obj, elm) {
  var child = new VText(obj.content);

  if (obj.href) {
    child = new VNode('A', { href: obj.href }, [ child ]);
  }

  if (obj.italic) {
    child = new VNode('EM', {}, [ child ]);
  }

  if (obj.bold) {
    child = new VNode('STRONG', {}, [ child ]);
  }

  return child;
};
