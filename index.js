'use strict';

var render = require('./lib/render');
var parse = require('./lib/parse');
var saveSelection = require('./lib/save-selection');
var restoreSelection = require('./lib/restore-selection');
var normalize = require('./lib/normalize');

module.exports = function (elm) {
  saveSelection(elm);
  render(elm, normalize(parse(elm)));
  restoreSelection(elm);
};