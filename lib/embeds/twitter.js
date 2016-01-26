
export default elm => {
  return {
    embedType: 'twitter',
    parse: elm => {
      const classes = (elm.getAttribute('class') || '').split(' ');
      if (classes.indexOf('twitter-tweet') === -1) {
        return;
      }

      const pElm = elm.childNodes[0];
      const authorElm = elm.childNodes[1];
      const aElm = elm.childNodes[2];

      return {
        author: authorElm.value.slice(2).trim(),
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
        url: aElm.getAttribute('href'),
        type: 'embed',
        embedType: 'twitter'
      };
    }
  };
};
