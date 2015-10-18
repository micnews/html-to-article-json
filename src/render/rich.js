const setupRenderText = require('./render-text');
const VNode = require('virtual-dom').VNode;
const setupRich = require('../rich-types');

module.exports = function (opts) {
  const renderText = setupRenderText(opts);
  const renderRich = setupRich(opts).reduce(function (obj, rich) {
    obj[rich.category] = rich.render;
    return obj;
  }, {});

  return function (obj) {
    if (obj.caption.length === 0) {
      return new VNode('FIGURE', {}, [ renderRich[obj.category](obj) ]);
    }

    return new VNode('FIGURE', {}, [
      renderRich[obj.category](obj, alt(obj)), figcaption(obj)
    ]);
  };

  function figcaption (obj) {
    return new VNode('FIGCAPTION', {}, obj.caption.map(renderText));
  }
};

function alt (obj) {
  return obj.caption.map(function (row) {
    return row.content;
  }).join('');
}
