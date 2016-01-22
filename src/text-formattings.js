const defaultTextFormattings = [
  {
    property: 'content',
    get: (elm) => elm.nodeType === 3 && elm.nodeValue
  },
  {
    property: 'href',
    get: (elm) => {
      if (elm.nodeType !== 1) {
        return null;
      }
      return (elm.nodeName.toLowerCase() === 'a' && elm.href || null);
    }
  },
  {
    property: 'italic',
    get: (elm) => {
      if (elm.nodeType !== 1) {
        return false;
      }
      const nodeName = elm.nodeName.toLowerCase();
      return nodeName === 'i' ||
        nodeName === 'em' ||
        elm.style.fontStyle === 'italic';
    }
  },
  {
    property: 'bold',
    get: (elm) => {
      if (elm.nodeType !== 1) {
        return false;
      }
      const fontWeight = elm.style.fontWeight;
      const nodeName = elm.nodeName.toLowerCase();
      return nodeName === 'b' ||
        nodeName === 'strong' ||
        fontWeight === 'bold' ||
        parseInt(fontWeight, 10) >= 700;
    }
  }
];

module.exports = (opts) => opts.customTextFormattings
    ? defaultTextFormattings.concat(opts.customTextFormattings) : defaultTextFormattings;
