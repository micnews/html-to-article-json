'use strict';

var generateFunction = require('generate-function');
var text = require('../text');

module.exports = function () {
  var fn = generateFunction();

  var renderTextOpts = text.reduce(function (opts, row) {
    opts[row.property] = row.is;
    return opts;
  }, {});

  fn = fn('function (opts, elm) {')('return {');

  Object.keys(renderTextOpts).forEach(function (key) {
    fn = fn(
      '  %s: opts[\'%s\'] || renderTextOpts[\'%s\'](elm),',
      key, key, key);
  });

  fn = fn('};')('}');

  return fn.toFunction({
    renderTextOpts: renderTextOpts
  });
};
