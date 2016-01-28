const embedType = 'facebook';
const type = 'embed';

export default elm => {
  if (!elm.classList.contains('fb-post') && !elm.classList.contains('fb-video')) {
    return null;
  }

  const url = elm.getAttribute('data-href');
  const embedAs = elm.classList.contains('fb-video') ? 'video' : 'post';

  return { embedAs, embedType, type, url };
};
