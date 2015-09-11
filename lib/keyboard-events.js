'use strict';

var dom = require('dom-events');

module.exports = function (elm, data) {
  dom.on(elm, 'keypress', function (event) {
    data.forEach(function (node) {
      node.children.some(function (child, index) {
        var next = node.children[index + 1];
        if (child.type === 'range-start' && index === 0) {
          node.children.unshift({
            type: 'text',
            content: event.key
          });
        } else {
          if (next.type === 'range-start' && child.type === 'text') {
            child.content = child.content + event.key;
          }
        }
        return false;
      });
    });
  });
};
