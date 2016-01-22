export default function (elm, nodeName) {
  return find(elm.childNodes, nodeName, []);
}

function find (children, nodeName, result) {
  for (let i = 0; i < children.length; ++i) {
    let elm = children[i];
    if (elm.nodeName === nodeName) {
      result.push(elm);
    }
    if (elm.childNodes) {
      find(elm.childNodes, nodeName, result);
    }
  }
  return result;
}
