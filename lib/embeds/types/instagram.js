const embedType = 'instagram';
const type = 'embed';

function testInstagramMediaEmbed (elm) {
  if (!elm.classList.contains('instagram-media')) {
    return null;
  }

  const paragraphs = elm.getElementsByTagName('p');
  if (!paragraphs[0]) {
    return null;
  }

  const postLink = paragraphs[0].getElementsByTagName('a')[0];
  const text = elm.hasAttribute('data-instgrm-captioned')
    ? postLink.childNodes[0].data : null;
  const url = postLink.getAttribute('href');
  const id = url.split('/').filter(Boolean).pop();

  return { embedType, type, text, url, id };
}

const regexp = /http:\/\/instagram\.com\/p\/([A-Za-z0-9_-]+)\/embed/;

function testInstagramIframe (elm) {
  if (elm.tagName.toLowerCase() !== 'iframe') {
    return null;
  }

  const url = elm.getAttribute('src') || '';
  const match = url.match(regexp);
  if (!match) {
    return null;
  }

  const id = match[1];

  return { embedType, type, text: '', url, id };
}

export default elm => {
  return testInstagramMediaEmbed(elm) || testInstagramIframe(elm);
};
