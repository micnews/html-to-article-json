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
  // https and no protocol (//) are valid secure embeds
  const secure = parsed.protocol === 'https:' || parsed.protocol === null;
  return { type: 'embed', embedType: 'custom', width, height, src, secure };
};
