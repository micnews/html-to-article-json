import Set from 'es6-set';
import setupEmbed from './embeds';
import setupText from './text';
import setupBlockElement from './block-element';
import toDOM from 'query-dom';

const HEAD_NODE_NAMES = new Set([
  'title', 'base', 'link', 'meta', 'script', 'noscript', 'style'
]);

const linebreak = elm => elm.tagName.toLowerCase() === 'br' ? { type: 'linebreak' } : null;

export default opts => {
  const text = setupText(opts);
  const embed = setupEmbed(opts);

  const parse = (elms, textOpts, result) => {
    for (let i = 0; i < elms.length; i++) {
      let elm = elms[i];

      // ELEMENT_NODE
      if (elm.tagName && !HEAD_NODE_NAMES.has(elm.tagName.toLowerCase())) {
        elementNode(elm, textOpts, result);
      }

      // TEXT_NODE or empty MARK
      if ((elm.nodeName === '#text' && elm.data.length > 0) ||
        (elm.tagName && elm.tagName.toLowerCase() === 'mark' && elm.childNodes.length === 0)) {
        result.push(text(textOpts, elm));
      }
    }
    return result;
  };

  const blockElement = setupBlockElement(parse, text);

  const elementNode = (elm, textOpts, result) => {
    const linebreakResult = linebreak(elm);
    if (linebreakResult) {
      result.push(linebreakResult);
      return;
    }

    const embedResult = embed(elm);
    if (embedResult) {
      result.push(embedResult);
      return;
    }

    const blockElementResult = blockElement(elm, textOpts);
    if (blockElementResult) {
      result.push(blockElementResult);
      return;
    }

    if (elm.childNodes.length) {
      parse(elm.childNodes, text(textOpts, elm), result);
    }
  };

  return input => {
    if (typeof input === 'string') {
      return parse(toDOM(input), {}, []);
    }

    if (input.nodeName) {
      return parse([input], {}, []);
    }

    return parse(input, {}, []);
  };
};
