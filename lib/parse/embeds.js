const setupText = require('./text');
const setupEmbed = require('../embeds');

module.exports = function (opts) {
  const embed = setupEmbed(opts);
  const text = setupText(opts);

  return function (elm) {
    let obj;
    for (let i = 0; i < embed.length; i++) {
      obj = embed[i].parse(elm);
      if (obj) {
        if (!obj.caption) {
          let figcaption = elm.getElementsByTagName('figcaption')[0];
          obj.caption = figcaption ? visit([figcaption], [], {}) : [];
        }

        return obj;
      }
    }

    return null;
  };

  function visit (elms, result, opts) {
    for (let i = 0; i < elms.length; i++) {
      let elm = elms[i];

      // ELEMENT_NODE
      if (elm.nodeType === 1) {
        if (elm.childNodes.length) {
          visit(elm.childNodes, result, text(opts, elm));
        }
      }

      // TEXT_NODE
      if (elm.nodeType === 3 && elm.nodeValue.length > 0) {
        result.push(text(opts, elm));
      }
    }

    return result;
  }
};
