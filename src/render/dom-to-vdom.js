var VNode = require('virtual-dom').VNode;
var VText = require('virtual-dom').VText;

module.exports = function (elm) {
  return new VNode('DIV', {}, parse(elm.childNodes));
};

function parse (childNodes) {
  var result = [];
  for (var i = 0; i < childNodes.length; i++) {
    var child = childNodes[i];

    // ELEMENT_NODE
    if (child.nodeType === 1) {
      result.push(
        new VNode(
          child.tagName,
          {
            attributes: getAttributes(child)
          },
          parse(child.childNodes)
        )
      );
    }
    // TEXT_NODE
    if (child.nodeType === 3) {
      result.push(new VText(childNodes[i].nodeValue));
    }
  }
  return result;
}

function getAttributes (elm) {
  var obj = {};
  var attr;
  for (var i = 0; i < elm.attributes.length; i++) {
    attr = elm.attributes[i].name;
    obj[attr] = elm.getAttribute(attr);
  }
  return obj;
}
