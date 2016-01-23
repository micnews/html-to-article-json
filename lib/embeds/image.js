module.exports = function () {
  return {
    embedType: 'image',
    parse: function (elm) {
      const nodeName = elm.nodeName.toLowerCase();

      if (nodeName === 'figure') {
        const img = elm.getElementsByTagName('img')[0];

        if (img) {
          return {
            type: 'embed',
            embedType: 'image',
            src: img.getAttribute('src'),
            caption: null
          };
        }
      } else if (nodeName === 'img') {
        const alt = elm.getAttribute('alt');

        return {
          type: 'embed',
          embedType: 'image',
          src: elm.getAttribute('src'),
          caption: alt ? [{ content: alt, type: 'text' }] : null
        };
      }

      return null;
    }
  };
};
