const generateFunction = require('generate-function');
const getTextFormattings = require('../text-formattings');

module.exports = function (opts) {
  const textFormattings = getTextFormattings(opts);

  let fn = generateFunction();

  const renderTextOpts = textFormattings.reduce(function (opts, row) {
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
