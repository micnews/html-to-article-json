import startsWith from 'lodash.startswith';
import { parse as parseEmbedly } from 'embedly-url';

const embedType = 'vine';
const type = 'embed';

const checkSrc = src => startsWith(src, 'https://vine.co/v/');
const regexp = /https:\/\/vine\.co\/v\/([^\/]+)/;

export default elm => {
  if (elm.tagName.toLowerCase() !== 'iframe') {
    return null;
  }

  const src = elm.getAttribute('src');
  if (!src) {
    return null;
  }

  const embedlyParsed = parseEmbedly(src);

  const url = embedlyParsed ? embedlyParsed.src : src;
  if (!checkSrc(url)) {
    return null;
  }

  const match = url.match(regexp);
  const id = match[1];

  return { embedType, type, url, id };
};
