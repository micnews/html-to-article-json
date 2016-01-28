import find from 'lodash.find';

const type = 'embed';
const embedType = 'twitter';

const getText = elm => {
  const pElm = elm.getElementsByTagName('p')[0];
  if (!pElm) {
    return [];
  }

  return pElm.childNodes.map((child) => {
    if (child.nodeName === '#text') {
      return {
        content: child.value,
        href: null
      };
    }

    if (child.nodeName === 'a') {
      return {
        content: child.childNodes[0].value,
        href: child.getAttribute('href')
      };
    }
  }).filter(Boolean);
};

const getUser = elm => {
  const userElm = find(elm.childNodes, child => child.nodeName === '#text');
  if (!userElm) {
    return {
      name: null,
      slug: null
    };
  }
  const userString = userElm.value;
  const lastIndex = userString.lastIndexOf('(');
  const userName = userString.slice(2, lastIndex).trim();
  const userSlug = userString.slice(lastIndex + 2, -2);

  return {
    name: userName,
    slug: userSlug
  };
};

export default elm => {
  if (!elm.classList.contains('twitter-tweet')) {
    return null;
  }

  const aElm = elm.getElementsByTagName('a').pop();
  const url = aElm.getAttribute('href');
  const id = url.split('/').filter(Boolean).pop();
  const date = aElm.childNodes[0].value;
  const user = getUser(elm);
  const text = getText(elm);

  if (!/^\d+$/.test(id)) {
    return null;
  }

  return { user, date, text, id, url, type, embedType };
};
