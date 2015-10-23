const VNode = require('virtual-dom').VNode;
const setupBlockElements = require('./block-elements');

module.exports = function (opts) {
  const blockElements = setupBlockElements(opts);

  return function (divOpts, nodes) {
    return new VNode('DIV', divOpts, blockElements(nodes));
  };
};
