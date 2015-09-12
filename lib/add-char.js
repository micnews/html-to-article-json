'use strict';

var Immutable = require('immutable');
var emptyRange = require('./empty-range');

module.exports = function (data, char) {
  data = emptyRange(data);
  data = normalizeRange(data);
  return insert(data, char);
};

function normalizeRange (data) {
  for (var index = 0; index < data.size - 1; ++index) {
    var node = data.get(index);
    var next = data.get(index + 1);
    var nodeStart = node.get('children').get(-1).get('type') === 'range-start';
    var nextEnd = next.get('children').get(0).get('type') === 'range-end';

    if (nodeStart && nextEnd) {
      var newNode = node.set('children',
        node.get('children').concat(next.get('children'))
      );
      return data.splice(index, 2, newNode);
    }
  }
  return data;
}

function insert (data, char) {
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
}
