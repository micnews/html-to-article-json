'use strict';

var getTextFormattings = require('../text-formattings');

module.exports = function (opts) {
  var textFormattings = getTextFormattings(opts);

  return function renderText (obj, elm) {
    var child = obj.content;

    textFormattings.forEach(function (row) {
      if (obj[row.property]) {
        child = row.render(child, obj);
      }
    });

    return child;
  };
};
