'use strict';

var render = require('./lib/render');
var parse = require('./lib/parse');
var patch = require('incremental-dom').patch;

module.exports = function (elm) {
  patch(elm, function () {
    render(parse(elm));
  });
};
