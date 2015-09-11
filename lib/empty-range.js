'use strict';

module.exports = function (data) {
  var keep = true;
  var skipCurrent = false;
  return data.filter(function (node) {
    if (node.children) {
      node.children = node.children.filter(function (child) {
        if (child.type === 'range-start') {
          keep = false;
          // return true so this is kept but the rest is removed
          skipCurrent = true;
          return true;
        }

        if (child.type === 'range-end') {
          keep = true;
        }

        return keep;
      });
    }

    if (skipCurrent) {
      skipCurrent = false;
      return true;
    }

    return keep;
  });
};
