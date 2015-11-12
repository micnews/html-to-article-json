const VNode = require('virtual-dom').VNode;

module.exports = function () {
  return {
    richType: 'image',
    render: function (obj, alt) {
      return alt
        ? new VNode('IMG', { src: obj.src, alt: alt })
        : new VNode('IMG', { src: obj.src });
    },
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
