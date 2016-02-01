import getDimensions from '../dimensions';

const createImage = (img, alt) => {
  const {width, height} = getDimensions(img);

  return {
    type: 'embed',
    embedType: 'image',
    src: img.getAttribute('src'),
    caption: alt ? [{ content: alt, type: 'text' }] : null,
    width, height
  };
};

export default elm => {
  const nodeName = elm.nodeName;

  if (nodeName === 'FIGURE') {
    const img = elm.getElementsByTagName('IMG')[0];

    if (img) {
      return createImage(img);
    }
  } else if (nodeName === 'IMG') {
    return createImage(elm, elm.getAttribute('alt'));
  }

  return null;
};
