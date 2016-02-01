import Set from 'es6-set';
import blockElements from 'block-elements';

const BLOCK_ELEMENTS = new Set(blockElements.map(name => name.toUpperCase()));
const TEXT_ELEMENTS = {
  H1: 'header1',
  H2: 'header2',
  H3: 'header3',
  H4: 'header4',
  H5: 'header5',
  H6: 'header6',
  P: 'paragraph',
  BLOCKQUOTE: 'blockquote'
};

// inject parse to avoid recursive requires
export default (parse, text) => {
  return (elm, textOpts) => {
    const nodeName = elm.nodeName;

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
