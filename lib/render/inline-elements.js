'use strict';

var renderText = require('./render-text');
var h = require('virtual-dom/h');

module.exports = function renderInline (data) {
  return data.map(function (obj) {
    if (obj.type === 'selection-marker') {
      var className = 'selection-marker-' + (obj.start ? 'start' : 'end');
      return h('span', { className: className });
    }

    if (obj.type === 'linebreak') {
      return h('br');
    }

    return renderText(obj);
  });
};
