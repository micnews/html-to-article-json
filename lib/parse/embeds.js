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
  spotify: ({spotifyUri, width, height, url}) => ({
    type: 'embed',
    embedType: 'spotify',
    caption: [],
    spotifyUri, width, height, url
  }),
  facebook: ({embedAs, headline, date, text, url, user}) => ({
    type: 'embed',
    embedType: 'facebook',
    caption: [],
    headline: headline || null,
    url, date, user, text, embedAs
  }),
  instagram: ({date, id, text, url, user}) => ({
    type: 'embed',
    embedType: 'instagram',
    caption: [],
    date: date || null,
    user: user || null,
    id, text, url
  }),
  twitter: ({embedAs, url, date, user, id, text}) => ({
    type: 'embed',
    embedType: 'twitter',
    caption: [],
    embedAs, url, date, user, id, text
  }),
  youtube: ({youtubeId}) => ({
    type: 'embed',
    embedType: 'youtube',
    caption: [],
    youtubeId
  }),
  tumblr: ({url, did, text}) => ({
    type: 'embed',
    embedType: 'tumblr',
    caption: [],
    url, did, text
  }),
  video: ({width, height, sources}) => ({
    type: 'embed',
    embedType: 'video',
    caption: [],
    width: width || null,
    height: height || null,
    sources
  }),
  image: ({width, height, src, alt}) => ({
    type: 'embed',
    embedType: 'image',
    caption: alt ? [{content: alt, type: 'text'}] : [],
    width: width || null,
    height: height || null,
    src
  })
};

export default opts => {
  const text = setupText(opts);
  const {customEmbedTypes = []} = opts;

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

  const parseCustomEmbed = elm => {
    for (let i = 0; i < customEmbedTypes.length; ++i) {
      const customEmbed = customEmbedTypes[i];
      const obj = customEmbed.parse(elm);
      if (obj) {
        return obj;
      }
    }
  };

  const parseBuiltinEmbed = elm => {
    const obj = parse(elm);
    return obj && transformers[obj.type] && transformers[obj.type](obj);
  };

  const toEmbedObj = elm => {
    return parseCustomEmbed(elm) || parseBuiltinEmbed(elm) || null;
  };

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
    if (elm.tagName && elm.tagName.toLowerCase() === 'figure') {
      const obj = getEmbed(elm.childNodes);
      if (obj) {
        const figcaptions = elm.getElementsByTagName('figcaption');
        obj.caption = getCaption(figcaptions, [], {});
      }
      return obj;
    }

    return toEmbedObj(elm);
  };
};
