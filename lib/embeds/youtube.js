import { parse as parseEmbedly } from 'embedly-url';
import getYoutubeId from 'get-youtube-id';

export default () => {
  return {
    embedType: 'youtube',
    parse: elm => {
      let nodeName = elm.nodeName.toLowerCase();

      if (nodeName === 'figure') {
        elm = elm.getElementsByTagName('iframe')[0];

        if (!elm) {
          return null;
        }

        nodeName = elm.nodeName.toLowerCase();
      }

      if (nodeName !== 'iframe') {
        return null;
      }

      const src = elm.getAttribute('src');
      const embedlyParsed = parseEmbedly(src);
      const youtubeId = embedlyParsed ? getYoutubeId(embedlyParsed.src) : getYoutubeId(src);
      return youtubeId && {
        type: 'embed',
        embedType: 'youtube',
        youtubeId
      };
    }
  };
};
