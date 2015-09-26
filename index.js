'use strict';

var render = require('./lib/render');
var parse = require('./lib/parse');
var saveSelection = require('./lib/save-selection');
var restoreSelection = require('./lib/restore-selection');
var normalize = require('./lib/normalize');

module.exports = function (opts) {
  opts = opts || {};
  var selection = typeof opts.saveSelection !== 'boolean' || opts.saveSelection;
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
