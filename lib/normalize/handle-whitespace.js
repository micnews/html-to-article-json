module.exports = function handleWhitespace (tree) {
  tree.forEach(function (obj) {
    if (obj.type === 'text') {
      obj.content = normalizeWhitespace(obj.content);
    } else if (obj.children) {
      handleWhitespace(obj.children);
    }
  });
};

function normalizeWhitespace (content) {
  for (; content.indexOf('\t') !== -1; content = content.replace('\t', ' '));
  for (; content.indexOf('\n') !== -1; content = content.replace('\n', ' '));
  for (; content.indexOf('  ') !== -1; content = content.replace('  ', ' '));
  return content;
}
