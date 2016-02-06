import setupText from './text';
import setupEmbed from '../embeds';

export default opts => {
  const embeds = setupEmbed(opts);
  const text = setupText(opts);

  const visit = (elms, result, opts) => {
    for (let i = 0; i < elms.length; i++) {
      let elm = elms[i];

      // ELEMENT_NODE
      if (elm.tagName) {
        if (elm.childNodes.length) {
          visit(elm.childNodes, result, text(opts, elm));
        }
      }

      // TEXT_NODE
      if (elm.nodeName === '#text' && elm.data.length > 0) {
        result.push(text(opts, elm));
      }
    }

    return result;
  };

  return elm => {
    let obj;
    for (let i = 0; i < embeds.length; i++) {
      obj = embeds[i](elm);
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
};
