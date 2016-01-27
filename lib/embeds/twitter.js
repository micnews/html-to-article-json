
export default elm => {
  return {
    embedType: 'twitter',
    parse: elm => {
      const classes = (elm.getAttribute('class') || '').split(' ');
      if (classes.indexOf('twitter-tweet') === -1) {
        return;
      }

      const pElm = elm.childNodes[0];
      const userString = elm.childNodes[1].value;
      const aElm = elm.childNodes[2];
      const userName = userString.slice(2, userString.lastIndexOf('(')).trim();
      const userSlug = userString.slice(userString.lastIndexOf('(') + 2, -2);
      const url = aElm.getAttribute('href');
      const id = url.split('/').filter(Boolean).pop();

      return {
        user: {
          name: userName,
          slug: userSlug
        },
        date: aElm.childNodes[0].value,
        text: pElm.childNodes.map((child) => {
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
        }).filter(Boolean),
        id,
        url,
        type: 'embed',
        embedType: 'twitter'
      };
    }
  };
};
