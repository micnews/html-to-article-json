'use strict';

var VNode = require('virtual-dom').VNode;
var VText = require('virtual-dom').VText;
var renderTextOpts = [
  { property: 'href', render: href },
  { property: 'italic', render: italic },
  { property: 'bold', render: bold }
];

module.exports = function (opts) {
  return function renderText (obj, elm) {
    var child = new VText(obj.content);

    renderTextOpts.forEach(function (row) {
      if (obj[row.property]) {
        child = row.render(child, obj);
      }
    });

    return child;
  };
};

function italic (child) {
  return new VNode('EM', {}, [ child ]);
}

function bold (child) {
  return new VNode('STRONG', {}, [ child ]);
}

function href (child, obj) {
  return new VNode('A', { href: obj.href }, [ child ]);
}
