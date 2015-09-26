'use strict';

var render = require('./lib/render');
var parse = require('./lib/parse');
var saveSelection = require('./lib/save-selection');
var restoreSelection = require('./lib/restore-selection');
var normalize = require('./lib/normalize');
var assert = require('assert');

module.exports = function (opts) {
  assert(opts, 'required: opts');
  assert(typeof opts.saveSelection === 'boolean',
    'required: opts.saveSelection is boolean');

  var selection = !!opts.saveSelection;
  return selection ? updateWithSelection : updateWithoutSelection;
};

function updateWithoutSelection (elm) {
  render(elm, normalize(parse(elm)));
}

function updateWithSelection (elm) {
  saveSelection(elm);
  updateWithoutSelection(elm);
  restoreSelection(elm);
}
