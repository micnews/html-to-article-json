import getDimensions from '../dimensions';

const type = 'embed';
const embedType = 'video';

const getSources = elm => {
  const sourceElms = elm.getElementsByTagName('SOURCE');

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
  let {tagName} = elm;

  if (tagName === 'FIGURE') {
    elm = elm.getElementsByTagName('VIDEO')[0];

    if (!elm) {
      return null;
    }

    tagName = elm.tagName;
  }

  if (tagName === 'VIDEO') {
    const {width, height} = getDimensions(elm);
    const sources = getSources(elm);

    return {
      type, embedType, sources, width, height
    };
  }

  return null;
};
