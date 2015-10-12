'use strict';

var setupRender = require('./lib/render');
var setupParse = require('./lib/parse');
var saveSelection = require('./lib/selection/save');
var restoreSelection = require('./lib/selection/restore');
var setupNormalize = require('./lib/normalize');
var assert = require('assert');

module.exports = function (opts) {
  assert(opts, 'required: opts');
  assert(typeof opts.saveSelection === 'boolean',
    'required: opts.saveSelection is boolean');

  var parse = setupParse(opts);
  var renderWithoutSelection = setupRender(opts);
  var normalize = setupNormalize(opts);

  var update = opts.saveSelection
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
