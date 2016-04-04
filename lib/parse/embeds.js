import setupText from './text';
import {parse} from 'embeds';

const transformers = {
  custom: ({height, width, secure, src}) => ({
    type: 'embed',
    embedType: 'custom',
    caption: [],
    width, height, secure, src
  }),
  vine: ({id, url}) => ({
    type: 'embed',
    embedType: 'vine',
    caption: [],
    id, url
  }),
  facebook: ({embedAs, headline, date, text, url, user}) => ({
    type: 'embed',
    embedType: 'facebook',
    caption: [],
    url, headline, date, user, text, embedAs
  }),
  instagram: ({date, id, text, url, user}) => ({
    type: 'embed',
    embedType: 'instagram',
    caption: [],
    date, id, text, url, user
  }),
  twitter: ({url, date, user, id, text}) => ({
    type: 'embed',
    embedType: 'twitter',
    caption: [],
    url, date, user, id, text
  }),
  youtube: ({youtubeId}) => ({
    type: 'embed',
    embedType: 'youtube',
    caption: [],
    youtubeId
  }),
  video: ({width, height, sources}) => ({
    type: 'embed',
    embedType: 'video',
    caption: [],
    width, height, sources
  }),
  image: ({width, height, src, alt}) => ({
    type: 'embed',
    embedType: 'image',
    caption: alt ? [{content: alt, type: 'text'}] : [],
    width, height, src
  })
};

const getEmbed = (elms) => {
  for (let i = 0; i < elms.length; i++) {
    let elm = elms[i];

    if (elm && elm.tagName) {
      const obj = toEmbedObj(elm) || getEmbed(elm.childNodes);
      if (obj) {
        return obj;
      }
    }
  }
};

const toEmbedObj = elm => {
  const obj = parse(elm);
  if (obj && transformers[obj.type]) {
    return transformers[obj.type](obj);
  }
  return null;
};

export default opts => {
  const text = setupText(opts);

  const getCaption = (elms, result, opts) => {
    for (let i = 0; i < elms.length; i++) {
      let elm = elms[i];

      // ELEMENT_NODE
      if (elm.tagName && elm.childNodes.length) {
        getCaption(elm.childNodes, result, text(opts, elm));
      }

      // TEXT_NODE
      if (elm.nodeName === '#text' && elm.data.length > 0) {
        result.push(text(opts, elm));
      }
    }

    return result;
  };

  return elm => {
    if (elm.tagName === 'figure') {
      const obj = getEmbed(elm.childNodes);
      if (obj) {
        const figcaption = elm.getElementsByTagName('figcaption')[0];
        obj.caption = figcaption ? getCaption([figcaption], [], {}) : [];
      }
      return obj;
    }

    return toEmbedObj(elm);
  };
};
