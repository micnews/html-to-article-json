'use strict';

var VText = require('virtual-dom').VText;
var textOpts = require('../text');

module.exports = function (opts) {
  return function renderText (obj, elm) {
    var child = new VText(obj.content);

    textOpts.forEach(function (row) {
      if (obj[row.property]) {
        child = row.render(child, obj);
      }
    });

    return child;
  };
};
