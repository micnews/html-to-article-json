import startsWith from 'lodash.startswith';

const embedType = 'vine';
const type = 'embed';

const checkSrc = elm => startsWith(elm.getAttribute('src'), 'https://vine.co/v/');
const regexp = /https:\/\/vine\.co\/v\/([^\/]+)/;

export default () => {
  const parse = elm => {
    if (!elm.tagName === 'iframe' || !checkSrc(elm)) {
      return null;
    }

    const url = elm.getAttribute('src');
    const match = url.match(regexp);
    const id = match[1];

    return { embedType, type, url, id };
  };

  return { embedType, parse };
};
