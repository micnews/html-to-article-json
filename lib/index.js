import createParse from './parse';
import createNormalize from './normalize';

module.exports = (opts = {}) => {
  const parse = createParse(opts);
  const normalize = createNormalize(opts);

  return elm => normalize(parse(elm));
};
