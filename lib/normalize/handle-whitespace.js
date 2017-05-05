const normalizeWhitespace = content => {
  content = content.replace(/(\t|\n| )+/g, ' ');
  return content;
};

const handleWhitespace = tree => {
  tree.forEach(obj => {
    if (obj.type === 'text' && obj.content) {
      obj.content = normalizeWhitespace(obj.content);
    } else if (obj.children) {
      handleWhitespace(obj.children);
    }
  });
};

export default handleWhitespace;
