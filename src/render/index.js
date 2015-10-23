const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const convertToVdom = require('./dom-to-vdom');
const setupRenderToVdom = require('./render-to-vdom');

module.exports = function (opts) {
  const renderToVdom = setupRenderToVdom(opts);

  return function (elm, nodes) {
    const rootContenteditable = elm.getAttribute('contenteditable') === 'true';
    const divOpts = {};
    if (rootContenteditable) {
      elm.contentEditable = 'true';
      elm.setAttribute('contenteditable', 'true');
      divOpts.contentEditable = 'true';
    }

    const tree = convertToVdom(elm);
    const newTree = renderToVdom(divOpts, nodes);
    patch(elm, diff(tree, newTree));
  };
};
