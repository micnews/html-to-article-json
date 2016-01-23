const normalizeWhitespace = content => {
  for (; content.indexOf('\t') !== -1; content = content.replace('\t', ' '));
  for (; content.indexOf('\n') !== -1; content = content.replace('\n', ' '));
  for (; content.indexOf('  ') !== -1; content = content.replace('  ', ' '));
  return content;
};

const handleWhitespace = tree => {
  tree.forEach(obj => {
    if (obj.type === 'text') {
      obj.content = normalizeWhitespace(obj.content);
    } else if (obj.children) {
      handleWhitespace(obj.children);
    }
  });
};

export default handleWhitespace;
