'use strict';

var render = require('./lib/render');
var parse = require('./lib/parse');

module.exports = function (elm) {
  render(elm, parse(elm));
};
