'use strict';

module.exports = function (data) {
  var keep = true;
  data.forEach(function (node) {
    if (node.children) {
      node.children = node.children.filter(function (child) {
        if (child.type === 'range-start') {
          keep = false;
          // return true so this is kept but the rest is removed
          return true;
        }

        if (child.type === 'range-end') {
          keep = true;
        }

        return keep;
      });
    }
  });
};
