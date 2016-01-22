module.exports = function () {
  return {
    richType: 'image',
    parse: function (elm) {
      const nodeName = elm.nodeName.toLowerCase();

      if (nodeName === 'figure') {
        const img = elm.getElementsByTagName('img')[0];

        if (img) {
          return {
            type: 'rich',
            richType: 'image',
            src: img.src,
            caption: null
          };
        }
      } else if (nodeName === 'img') {
        return {
          type: 'rich',
          richType: 'image',
          src: elm.src,
          caption: elm.alt ? [{ content: elm.alt, type: 'text' }] : null
        };
      }

      return null;
    }
  };
};
