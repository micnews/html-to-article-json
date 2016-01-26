const defaultTextFormattings = [
  {
    property: 'content',
    get: elm => elm.nodeName === '#text' && elm.value
  },
  {
    property: 'href',
    get: elm => {
      if (!elm.tagName) {
        return null;
      }
      return (elm.nodeName === 'a' && elm.getAttribute('href') || null);
    }
  },
  {
    property: 'italic',
    get: elm => {
      if (!elm.tagName) {
        return false;
      }
      const nodeName = elm.nodeName;

      return nodeName === 'i' ||
        nodeName === 'em' ||
        elm.style.fontStyle === 'italic';
    }
  },
  {
    property: 'bold',
    get: elm => {
      if (!elm.tagName) {
        return false;
      }
      const fontWeight = elm.style.fontWeight;
      const nodeName = elm.nodeName;
      return nodeName === 'b' ||
        nodeName === 'strong' ||
        fontWeight === 'bold' ||
        parseInt(fontWeight, 10) >= 700;
    }
  }
];

export default opts => opts.customTextFormattings
    ? defaultTextFormattings.concat(opts.customTextFormattings) : defaultTextFormattings;
