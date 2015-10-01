'use strict';

var VNode = require('virtual-dom').VNode;

module.exports = [
  {
    property: 'href',
    render: function href (child, obj) {
      return new VNode('A', { href: obj.href }, [ child ]);
    },
    is: function isHref (elm) {
      return (elm.nodeName.toLowerCase() === 'a' && elm.href || null);
    }
  },
  {
    property: 'italic',
    render: function italic (child) {
      return new VNode('EM', {}, [ child ]);
    },
    is: function isItalic (elm) {
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
    is: function isBold (elm) {
      var fontWeight = elm.style.fontWeight;
      var nodeName = elm.nodeName.toLowerCase();
      return nodeName === 'b' ||
        nodeName === 'strong' ||
        fontWeight === 'bold' ||
        parseInt(fontWeight, 10) >= 700;
    }
  }
];
