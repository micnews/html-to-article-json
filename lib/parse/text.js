import generateFunction from 'generate-function';
import getTextFormattings from '../text-formattings';

export default opts => {
  const textFormattings = getTextFormattings(opts);

  let fn = generateFunction();

  const renderTextOpts = textFormattings.reduce((opts, row) => {
    opts[row.property] = row.get;
    return opts;
  }, {});

  fn = fn('function text (opts, elm) {')('return {');
  fn = fn('  type: \'text\',');

  Object.keys(renderTextOpts).forEach(key => {
    fn = fn(
      '  %s: opts[\'%s\'] || renderTextOpts[\'%s\'](elm),',
      key, key, key);
  });

  fn = fn('};')('}');

  return fn.toFunction({
    renderTextOpts: renderTextOpts
  });
};
