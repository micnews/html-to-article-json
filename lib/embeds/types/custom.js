import url from 'url';
import getDimensions from '../dimensions';

export default elm => {
  if (elm.tagName.toLowerCase() !== 'iframe') {
    return null;
  }

  const src = elm.getAttribute('src');
  const {width, height} = getDimensions(elm);
  if (!src || !width || !height) {
    return null;
  }

  const parsed = url.parse(src, false, true);
  const secure = parsed.protocol === 'https:';
  return { type: 'embed', embedType: 'custom', width, height, src, secure };
};
