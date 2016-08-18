const defaultTextFormattings = [
  {
    property: 'content',
    get: elm => (elm.nodeName === '#text' && elm.data) || null
  },
  {
    property: 'href',
    get: elm => {
      if (!elm.tagName) {
        return null;
      }
      return (elm.tagName.toLowerCase() === 'a' && elm.getAttribute('href') || null);
    }
  },
  {
    property: 'italic',
    get: elm => {
      if (!elm.tagName) {
        return false;
      }
      const tagName = elm.tagName.toLowerCase();

      return tagName === 'i' ||
        tagName === 'em' ||
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
      const tagName = elm.tagName.toLowerCase();
      return tagName === 'b' ||
        tagName === 'strong' ||
        fontWeight === 'bold' ||
        parseInt(fontWeight, 10) >= 700;
    }
  },
  {
    property: 'mark',
    classProperty: 'markClass',
    getClass: elm => {
      if (!elm.tagName || elm.tagName.toLowerCase() !== 'mark') {
        return null;
      }

      return elm.getAttribute('class');
    },
    get: elm => {
      if (!elm.tagName) {
        return false;
      }

      const tagName = elm.tagName.toLowerCase();
      return tagName === 'mark';
    }
  },
  {
    property: 'strikethrough',
    get: elm => {
      if (!elm.tagName) {
        return false;
      }

      const tagName = elm.tagName.toLowerCase();
      return tagName === 's' ||
        tagName === 'strike' ||
        tagName === 'del';
    }
  }
];

export default opts => opts.customTextFormattings
    ? defaultTextFormattings.concat(opts.customTextFormattings) : defaultTextFormattings;
