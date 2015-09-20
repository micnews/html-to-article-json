'use strict';

var renderText = require('./render-text');

module.exports = function renderInline (data, elm) {
  data.forEach(function (obj) {
    if (obj.type === 'selection-marker') {
      var className = 'selection-marker-' + (obj.start ? 'start' : 'end');
      var selectionMarker = elm.appendChild(document.createElement('span'));
      selectionMarker.className = className;
      return;
    }

    if (obj.type === 'linebreak') {
      elm.appendChild(document.createElement('br'));
      return;
    }

    renderText(obj, elm);
  });
};
