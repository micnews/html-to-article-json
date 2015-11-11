const Set = require('es6-set');
const BLOCK_ELEMENTS = new Set(require('block-elements'));
const TEXT_ELEMENTS = {
  h1: 'header1',
  h2: 'header2',
  h3: 'header3',
  h4: 'header4',
  h5: 'header5',
  h6: 'header6',
  p: 'paragraph'
};

// inject parse to avoid recursive requires
module.exports = function (parse, text) {
  return function (elm, textOpts) {
    var nodeName = elm.nodeName.toLowerCase();

    if (BLOCK_ELEMENTS.has(nodeName)) {
      const blockElement = {
        type: TEXT_ELEMENTS[nodeName] || 'block',
        children: []
      };
      if (elm.childNodes.length) {
        parse(elm.childNodes, text(textOpts, elm), blockElement.children);
      }

      return blockElement;
    }
  };
};
