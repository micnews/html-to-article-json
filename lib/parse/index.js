import Set from 'es6-set';
import setupEmbed from './embeds';
import setupText from './text';
import setupBlockElement from './block-element';
import toDOM from './to-dom';

const HEAD_NODE_NAMES = new Set([
  'title', 'base', 'link', 'meta', 'script', 'noscript', 'style'
]);

module.exports = function (opts) {
  const text = setupText(opts);
  const embed = setupEmbed(opts);
  const blockElement = setupBlockElement(parse, text);

  return function getResult (html) {
    const dom = toDOM(html);

    return parse(dom, {}, []);
  };

  function parse (elms, textOpts, result) {
    for (let i = 0; i < elms.length; i++) {
      let elm = elms[i];

      // ELEMENT_NODE
      if (elm.tagName && !HEAD_NODE_NAMES.has(elm.nodeName)) {
        elementNode(elm, textOpts, result);
      }

      // TEXT_NODE
      if (elm.nodeName === '#text' && elm.value.length > 0) {
        result.push(text(textOpts, elm));
      }
    }
    return result;
  }

  function elementNode (elm, textOpts, result) {
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
  }
};

function linebreak (elm) {
  return elm.tagName === 'br' ? { type: 'linebreak' } : null;
}
