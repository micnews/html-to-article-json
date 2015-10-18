'use strict';

var generateFunction = require('generate-function');
var getTextFormattings = require('../text-formattings');

module.exports = function (opts) {
  var textFormattings = getTextFormattings(opts);

  var fn = generateFunction();

  var renderTextOpts = textFormattings.reduce(function (opts, row) {
    opts[row.property] = row.get;
    return opts;
  }, {});

  fn = fn('function optsFromElm (opts, elm) {')('return {');
  fn = fn('  type: \'text\',');

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
