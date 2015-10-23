const vdomToHtml = require('vdom-to-html');
const renderVdom = require('./render/render-to-vdom')({});

module.exports = function (nodes) {
  return vdomToHtml(renderVdom({}, nodes));
};
