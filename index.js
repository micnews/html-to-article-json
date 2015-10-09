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
  var render = setupRender(opts);
  var normalize = setupNormalize(opts);

  return opts.saveSelection ? updateWithSelection : updateWithoutSelection;

  function updateWithoutSelection (elm) {
    var normalized = normalize(parse(elm));
    render(elm, normalized);
  }

  function updateWithSelection (elm) {
    saveSelection(elm);
    updateWithoutSelection(elm);
    restoreSelection(elm);
  }
};
