const createParse = require('./parse');
const createNormalize = require('./normalize');

module.exports = setupParse;

function setupParse (opts = {}) {
  const parse = createParse(opts);
  const normalize = createNormalize(opts);

  return function (elm) {
    return normalize(parse(elm));
  };
}
