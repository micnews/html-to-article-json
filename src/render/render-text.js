const getTextFormattings = require('../text-formattings');
const generateFunction = require('generate-function');

module.exports = function (opts) {
  const textFormattings = getTextFormattings(opts);

  let fn = generateFunction();

  fn = fn('function renderText (obj, elm) {');
  fn = fn('  var child = obj.content;');
  fn = fn('  var row;');

  textFormattings.forEach(function (row, index) {
    fn = fn('  row = textFormattings[' + index + ']');
    fn = fn('  if (obj[row.property]) {');
    fn = fn('    child = row.render(child, obj)');
    fn = fn('  }');
  });

  fn = fn('  return child;');
  fn = fn('}');

  return fn.toFunction({ textFormattings });
};
