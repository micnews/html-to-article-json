const createImage = (img, alt) => {
  const width = parseInt(img.getAttribute('width') || img.style.width, 10) || undefined;
  const height = parseInt(img.getAttribute('height') || img.style.height, 10) || undefined;

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

  if (nodeName === 'figure') {
    const img = elm.getElementsByTagName('img')[0];

    if (img) {
      return createImage(img);
    }
  } else if (nodeName === 'img') {
    return createImage(elm, elm.getAttribute('alt'));
  }

  return null;
};
