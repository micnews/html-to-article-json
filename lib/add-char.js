'use strict';

var Immutable = require('immutable');

module.exports = function (data, char) {
  for (var nodeIndex = 0; nodeIndex < data.size; ++nodeIndex) {
    var children = data.get(nodeIndex).get('children');

    for (var childIndex = 0; childIndex < children.size; ++childIndex) {
      var child = children.get(childIndex);
      if (child.get('type') === 'range-start' && childIndex === 0) {
        return data.updateIn(
          [nodeIndex, 'children'],
          function (children) {
            return children.unshift(Immutable.Map({
              type: 'text',
              content: char
            }));
          }
        );
      } else if (child.get('type') === 'range-start') {
        return data.updateIn(
          [nodeIndex, 'children', childIndex - 1],
          function (prev) {
            return prev.set('content', prev.get('content') + char);
          }
        );
      }
    }
  }
};
