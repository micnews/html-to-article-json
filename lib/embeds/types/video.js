import getDimensions from '../dimensions';

const type = 'embed';
const embedType = 'video';

const getSources = elm => {
  const sourceElms = elm.getElementsByTagName('source');

  if (sourceElms.length) {
    return sourceElms.map(sourceElm => {
      return {
        src: sourceElm.getAttribute('src'),
        type: sourceElm.getAttribute('type') || null
      };
    });
  }

  return [{
    src: elm.getAttribute('src'),
    type: null
  }];
};

export default elm => {
  let nodeName = elm.nodeName;

  if (nodeName === 'figure') {
    elm = elm.getElementsByTagName('video')[0];

    if (!elm) {
      return null;
    }

    nodeName = elm.nodeName;
  }

  if (nodeName === 'video') {
    const {width, height} = getDimensions(elm);
    const sources = getSources(elm);

    return {
      type, embedType, sources, width, height
    };
  }

  return null;
};
