const createRender = require('./render');
const createParse = require('./parse');
const saveSelection = require('./selection/save');
const restoreSelection = require('./selection/restore');
const createNormalize = require('./normalize');
const assert = require('assert');

module.exports = setupUpdate;
module.exports.update = setupUpdate;
module.exports.parse = setupParse;
module.exports.render = setupRender;

function setupUpdate (opts) {
  const render = setupRender(opts);
  const parse = setupParse(opts);

  return function (elm) {
    render(elm, parse(elm));
  };
}

function setupParse (opts) {
  validate(opts);
  const parse = createParse(opts);
  const normalize = createNormalize(opts);

  return opts.saveSelection ? parseWithSelection : parseWithoutSelection;

  function parseWithSelection (elm) {
    saveSelection(elm);
    return parseWithoutSelection(elm);
  }

  function parseWithoutSelection (elm) {
    return normalize(parse(elm));
  }
}

function setupRender (opts) {
  validate(opts);
  const renderWithoutSelection = createRender(opts);

  return opts.saveSelection ? renderWithSelection : renderWithoutSelection;

  function renderWithSelection (elm, json) {
    renderWithoutSelection(elm, json);
    restoreSelection(elm);
  }
}

function validate (opts) {
  assert(opts, 'required: opts');
  assert(typeof opts.saveSelection === 'boolean',
    'required: opts.saveSelection is boolean');
}
