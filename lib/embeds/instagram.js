const embedType = 'instagram';
const type = 'embed';

export default () => {
  const parse = elm => {
    if (!elm.classList.contains('instagram-media')) {
      return null;
    }

    const paragraphs = elm.getElementsByTagName('p');
    if (!paragraphs[0]) {
      return null;
    }

    const postLink = paragraphs[0].getElementsByTagName('a')[0];
    const text = elm.hasAttribute('data-instgrm-captioned')
      ? postLink.childNodes[0].value : null;
    const url = postLink.getAttribute('href');
    const id = url.split('/').filter(Boolean).pop();

    return { embedType, type, text, url, id };
  };

  return { embedType, parse };
};
