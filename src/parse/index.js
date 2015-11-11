const Set = require('es6-set');
const HEAD_NODE_NAMES = new Set([
  'TITLE', 'BASE', 'LINK', 'META', 'SCRIPT', 'NOSCRIPT', 'STYLE'
]);

const setupRich = require('./rich');
const setupText = require('./text');
const selectionMarker = require('./selection-marker');
const setupBlockElement = require('./block-element');

module.exports = function (opts) {
  const text = setupText(opts);
  const rich = setupRich(opts);
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

    const selectionMarkerResult = selectionMarker(elm);
    if (selectionMarkerResult) {
      result.push(selectionMarkerResult);
      return;
    }

    const richResult = rich(elm);
    if (richResult) {
      result.push(richResult);
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
