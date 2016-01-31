import { parse as parseEmbedly } from 'embedly-url';
import getYoutubeId from 'get-youtube-id';

export default elm => {
  let nodeName = elm.nodeName;

  if (nodeName === 'figure') {
    elm = elm.getElementsByTagName('iframe')[0];

    if (!elm) {
      return null;
    }

    nodeName = elm.nodeName;
  }

  if (nodeName !== 'iframe') {
    return null;
  }

  const src = elm.getAttribute('src');
  if (!src) {
    return null;
  }

  const embedlyParsed = parseEmbedly(src);
  const youtubeId = embedlyParsed
    ? getYoutubeId(embedlyParsed.src) : getYoutubeId(src);
  return youtubeId && {
    type: 'embed',
    embedType: 'youtube',
    youtubeId
  };
};
