const Set = require('es6-set');
const HEAD_NODE_NAMES = new Set([
  'TITLE', 'BASE', 'LINK', 'META', 'SCRIPT', 'NOSCRIPT', 'STYLE'
]);

const setupEmbed = require('./embeds');
const setupText = require('./text');
const setupBlockElement = require('./block-element');

module.exports = function (opts) {
  const text = setupText(opts);
  const embed = setupEmbed(opts);
  const blockElement = setupBlockElement(parse, text);

  return function getResult (elm) {
    return parse([elm], {}, []);
  };

  function parse (elms, textOpts, result) {
    for (let i = 0; i < elms.length; i++) {
      let elm = elms[i];

      // ELEMENT_NODE
      if (elm.nodeType === 1 && !HEAD_NODE_NAMES.has(elm.nodeName)) {
        elementNode(elm, textOpts, result);
      }

      // TEXT_NODE
      if (elm.nodeType === 3 && elm.nodeValue.length > 0) {
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
  return elm.nodeName === 'BR' ? { type: 'linebreak' } : null;
}
