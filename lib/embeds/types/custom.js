import url from 'url';

export default elm => {
  if (elm.nodeName !== 'iframe') {
    return null;
  }

  const src = elm.getAttribute('src');
  const width = Number(elm.getAttribute('width'));
  const height = Number(elm.getAttribute('height'));
  if (!src || !width || !height) {
    return null;
  }

  const parsed = url.parse(src, false, true);
  const secure = parsed.protocol === 'https:';
  return { type: 'embed', embedType: 'custom', width, height, src, secure };
};
