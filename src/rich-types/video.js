const VNode = require('virtual-dom').VNode;
const arrayFrom = require('array-from');

module.exports = function () {
  return {
    richType: 'video',
    render: function (obj, alt) {
      return new VNode('VIDEO', {}, obj.sources.map(function (source) {
        return new VNode('SOURCE', {
          src: source.src || undefined,
          type: source.type || undefined
        });
      }));
    },
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
            type: 'rich',
            richType: 'video',
            sources: arrayFrom(sources).map(function (sourceElm) {
              return {
                src: sourceElm.src,
                type: sourceElm.type || null
              };
            })
          };
        }

        return {
          type: 'rich',
          richType: 'video',
          sources: [{
            src: elm.src,
            type: null
          }],
          caption: null
        };
      }

      return null;
    }
  };
};
