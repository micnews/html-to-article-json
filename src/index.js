const setupRender = require('./render');
const setupParse = require('./parse');
const saveSelection = require('./selection/save');
const restoreSelection = require('./selection/restore');
const setupNormalize = require('./normalize');
const assert = require('assert');

module.exports = function (opts) {
  assert(opts, 'required: opts');
  assert(typeof opts.saveSelection === 'boolean',
    'required: opts.saveSelection is boolean');

  const parse = setupParse(opts);
  const renderWithoutSelection = setupRender(opts);
  const normalize = setupNormalize(opts);

  const update = opts.saveSelection
    ? updateWithSelection : updateWithoutSelection;

  update.parse = opts.saveSelection
    ? parseWithSelection : parseWithoutSelection;

  update.render = opts.saveSelection
    ? renderWithSelection : renderWithoutSelection;

  return update;

  function updateWithoutSelection (elm) {
    renderWithoutSelection(elm, parseWithoutSelection(elm));
  }

  function updateWithSelection (elm) {
    renderWithSelection(elm, parseWithSelection(elm));
  }

  function parseWithSelection (elm) {
    saveSelection(elm);
    return parseWithoutSelection(elm);
  }

  function parseWithoutSelection (elm) {
    return normalize(parse(elm));
  }

  function renderWithSelection (elm, json) {
    renderWithoutSelection(elm, json);
    restoreSelection(elm);
  }
};
