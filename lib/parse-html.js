'use strict';

var types = {
  h1: 'header1',
  h2: 'header2',
  h3: 'header3',
  h4: 'header4',
  h5: 'header5',
  h6: 'header6',
  p: 'paragraph'
};

module.exports = function (elm) {
  var result = [];

  parse(elm, {
    type: '',
    content: null,
    href: null,
    bold: false,
    italic: false
  }, result);

  return result;
};

function parse (elm, opts, result) {
  var index;
  // ELEMENT_NODE
  if (elm.nodeType === 1) {
    var nodeName = elm.nodeName.toLowerCase();
    var type = types[nodeName];

    if (type) {
      var parent = { type: type, children: [] };
      result.push(parent);
      for (index = 0; index < elm.childNodes.length; ++index) {
        parseText(elm.childNodes[index], opts, parent);
      }
    } else {
      for (index = 0; index < elm.childNodes.length; ++index) {
        parse(elm.childNodes[index], opts, result);
      }
    }
  }

  // TEXT_NODE
  if (elm.nodeType === 3) {
    result.push({
      type: 'paragraph',
      children: [
        extend(opts, {
          content: elm.nodeValue
        })
      ]
    });
  }
}

function parseText (elm, opts, parent) {
  // TEXT_NODE
  if (elm.nodeType === 3) {
    parent.children.push(extend(opts, {
      content: elm.nodeValue
    }));
  }

  // ELEMENT_NODE
  if (elm.nodeType === 1) {
    var nodeName = elm.nodeName.toLowerCase();
    if (nodeName === 'b') {
      opts = extend(opts, {
        bold: true
      });
    } else if (nodeName === 'i') {
      opts = extend(opts, {
        italic: true
      });
    } else if (nodeName === 'a') {
      opts = extend(opts, {
        href: elm.href
      });
    }

    for (var j = 0; j < elm.childNodes.length; ++j) {
      parseText(elm.childNodes[j], opts, parent);
    }
  }
}

function extend (opts, update) {
  return {
    type: 'text',
    content: update.content || opts.content,
    href: update.href || opts.href,
    bold: update.bold || opts.bold,
    italic: update.italic || opts.italic
  };
}
