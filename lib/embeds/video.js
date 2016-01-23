import arrayFrom from 'array-from';

module.exports = function () {
  return {
    embedType: 'video',
    parse: function (elm) {
      let nodeName = elm.nodeName.toLowerCase();

      if (nodeName === 'figure') {
        elm = elm.getElementsByTagName('video')[0];

        if (!elm) {
          return null;
        }

        nodeName = elm.nodeName.toLowerCase();
      }

      if (nodeName === 'video') {
        const sources = elm.getElementsByTagName('source');

        if (sources.length) {
          return {
            type: 'embed',
            embedType: 'video',
            sources: arrayFrom(sources).map(function (sourceElm) {
              return {
                src: sourceElm.getAttribute('src'),
                type: sourceElm.getAttribute('type') || null
              };
            })
          };
        }

        return {
          type: 'embed',
          embedType: 'video',
          sources: [{
            src: elm.getAttribute('src'),
            type: null
          }],
          caption: null
        };
      }

      return null;
    }
  };
};
