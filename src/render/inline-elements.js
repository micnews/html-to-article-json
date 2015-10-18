const setupRenderText = require('./render-text');
const VNode = require('virtual-dom').VNode;

module.exports = function (opts) {
  const renderText = setupRenderText(opts);
  return function renderInline (data) {
    return data.map(function (obj) {
      if (obj.type === 'selection-marker') {
        const className = 'selection-marker-' + (obj.start ? 'start' : 'end');
        return new VNode('SPAN', { className: className });
      }

      if (obj.type === 'linebreak') {
        return new VNode('BR');
      }

      return renderText(obj);
    });
  };
};
