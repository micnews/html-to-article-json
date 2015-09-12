'use strict';

var Immutable = require('immutable');

module.exports = function (data) {
  var keep = true;

  return data.reduce(function (result, node) {
    if (!keep && node.get('children').every(function (child) {
        return child.get('type') !== 'range-end';
      })) {
      return result;
    }

    return result.push(
      node.set('children',
        node.get('children').filter(function (child) {
          if (child.get('type') === 'range-start') {
            keep = false;
            return true;
          }

          if (child.get('type') === 'range-end') {
            keep = true;
          }

          return keep;
        })
      )
    );
  }, Immutable.List());
};
