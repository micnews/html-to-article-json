const setupBlockElements = require('./block-elements');
const VNode = require('virtual-dom').VNode;
const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const toVdom = require('./dom-to-vdom');

module.exports = function (opts) {
  return function (elm, nodes) {
    const blockElements = setupBlockElements(opts);
    const rootContenteditable = elm.getAttribute('contenteditable') === 'true';
    const divOpts = {};
    if (rootContenteditable) {
      elm.contentEditable = 'true';
      elm.setAttribute('contenteditable', 'true');
      divOpts.contentEditable = 'true';
    }

    const tree = toVdom(elm);
    const newTree = new VNode('DIV', divOpts, blockElements(nodes, opts));
    patch(elm, diff(tree, newTree));
  };
};
