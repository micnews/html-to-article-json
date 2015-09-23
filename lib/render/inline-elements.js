'use strict';

var renderText = require('./render-text');
var VNode = require('virtual-dom').VNode;

module.exports = function renderInline (data) {
  return data.map(function (obj) {
    if (obj.type === 'selection-marker') {
      var className = 'selection-marker-' + (obj.start ? 'start' : 'end');
      return new VNode('SPAN', { className: className });
    }

    if (obj.type === 'linebreak') {
      return new VNode('BR');
    }

    return renderText(obj);
  });
};
