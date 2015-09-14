'use strict';

var unwrap = require('unwrap-node');

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

  parse(cloneAndNormalize(elm), {
    type: '',
    content: null,
    href: null,
    bold: false,
    italic: false
  }, result);

  return result;
};

// TODO: we should probably tokenize here rather than making a clone of the DOM
function cloneAndNormalize (elm) {
  var clone = elm.cloneNode(true);
  var spans = clone.querySelectorAll('span');
  for (var i = 0; i < spans.length; i++) {
    unwrap(spans[i]);
  }
  clone.normalize();
  return clone;
}

function parse (elm, opts, result) {
  // ELEMENT_NODE
  if (elm.nodeType === 1) {
    var nodeName = elm.nodeName.toLowerCase();
    var type = types[nodeName];

    if (type) {
      var parent = { type: type, children: [] };
      result.push(parent);
      if (elm.firstChild) {
        parseText(elm.firstChild, opts, parent);
      }
    } else {
      if (elm.firstChild) {
        parse(elm.firstChild, opts, result);
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

  // take next sibling
  if (elm.nextSibling) {
    parse(elm.nextSibling, opts, result);
  }
}

function parseText (elm, parentOpts, parent) {
  // TEXT_NODE
  if (elm.nodeType === 3) {
    parent.children.push(extend(parentOpts, {
      content: elm.nodeValue
    }));
  }

  // ELEMENT_NODE
  if (elm.nodeType === 1) {
    if (elm.firstChild) {
      parseText(elm.firstChild, optsFromElm(parentOpts, elm), parent);
    }
  }
  if (elm.nextSibling) {
    parseText(elm.nextSibling, parentOpts, parent);
  }
}

function optsFromElm (opts, elm) {
  var nodeName = elm.nodeName.toLowerCase();
  if (nodeName === 'b') {
    return extend(opts, {
      bold: true
    });
  }
  if (nodeName === 'i') {
    return extend(opts, {
      italic: true
    });
  }
  if (nodeName === 'a') {
    return extend(opts, {
      href: elm.href
    });
  }
  return opts;
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
