import Set from 'es6-set';
import blockElements from 'block-elements';

const BLOCK_ELEMENTS = new Set(blockElements);
const TEXT_ELEMENTS = {
  h1: 'header1',
  h2: 'header2',
  h3: 'header3',
  h4: 'header4',
  h5: 'header5',
  h6: 'header6',
  p: 'paragraph',
  blockquote: 'blockquote'
};

// inject parse to avoid recursive requires
export default (parse, text) => {
  return (elm, textOpts) => {
    const tagName = elm.tagName.toLowerCase();

    if (BLOCK_ELEMENTS.has(tagName)) {
      const blockElement = {
        type: TEXT_ELEMENTS[tagName] || 'block',
        children: []
      };
      if (elm.childNodes.length) {
        parse(elm.childNodes, text(textOpts, elm), blockElement.children);
      }

      return blockElement;
    }
  };
};
