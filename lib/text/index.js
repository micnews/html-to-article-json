'use strict';

var VNode = require('virtual-dom').VNode;

module.exports = [
  {
    property: 'href',
    render: function href (child, obj) {
      return new VNode('A', { href: obj.href }, [ child ]);
    },
    get: function getHref (elm) {
      return (elm.nodeName.toLowerCase() === 'a' && elm.href || null);
    }
  },
  {
    property: 'italic',
    render: function italic (child) {
      return new VNode('EM', {}, [ child ]);
    },
    get: function getItalic (elm) {
      var nodeName = elm.nodeName.toLowerCase();
      return nodeName === 'i' ||
        nodeName === 'em' ||
        elm.style.fontStyle === 'italic';
    }
  },
  {
    property: 'bold',
    render: function bold (child) {
      return new VNode('STRONG', {}, [ child ]);
    },
    get: function getBold (elm) {
      var fontWeight = elm.style.fontWeight;
      var nodeName = elm.nodeName.toLowerCase();
      return nodeName === 'b' ||
        nodeName === 'strong' ||
        fontWeight === 'bold' ||
        parseInt(fontWeight, 10) >= 700;
    }
  }
];
