'use strict';

var buildSimpleTree = require('./build-simple-tree');
var normalize = require('./normalize');

module.exports = function (elm) {
  var tree = buildSimpleTree(elm);

  return normalize(tree);
};
