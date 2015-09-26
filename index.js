'use strict';

var render = require('./lib/render');
var setupParse = require('./lib/parse');
var saveSelection = require('./lib/save-selection');
var restoreSelection = require('./lib/restore-selection');
var normalize = require('./lib/normalize');
var assert = require('assert');

module.exports = function (opts) {
  assert(opts, 'required: opts');
  assert(typeof opts.saveSelection === 'boolean',
    'required: opts.saveSelection is boolean');

  var parse = setupParse(opts);

  return opts.saveSelection ? updateWithSelection : updateWithoutSelection;

  function updateWithoutSelection (elm) {
    render(elm, normalize(parse(elm)));
  }

  function updateWithSelection (elm) {
    saveSelection(elm);
    updateWithoutSelection(elm);
    restoreSelection(elm);
  }
};
