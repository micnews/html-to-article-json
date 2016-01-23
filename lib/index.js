import createParse from './parse';
import createNormalize from './normalize';

export default (opts = {}) => {
  const parse = createParse(opts);
  const normalize = createNormalize(opts);

  return elm => normalize(parse(elm));
};
