'use strict';

require('./mock-jsdom-browser');

var test = require('tape');
var VNode = require('virtual-dom').VNode;
var setupUpdate = require('../index');
var setupParse = require('../lib/parse');

test('custom text formattings: add underline span-type', function (t) {
  var opts1 = {
    saveSelection: false,
    customTextFormattings: [{
      property: 'underline',
      get: function (elm) {
        return elm.nodeType === 1 && elm.style.textDecoration === 'underline';
      },
      render: function (child) {
        return new VNode('span', {
          attributes: {
            style: 'text-decoration: underline;'
          }
        }, [child]);
      }
    }]
  };
  var update = setupUpdate(opts1);
  var update2 = setupUpdate({
    saveSelection: false
  });

  var parse = setupParse(opts1);

  var elm1 = createElement(
    '<p>foo<span style="text-decoration: underline">bar</span></p>');
  t.deepEqual(parse(elm1), [
    {
      type: 'div',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              content: 'foo',
              href: null,
              italic: false,
              bold: false,
              underline: false
            },
            {
              type: 'text',
              content: 'bar',
              href: null,
              italic: false,
              bold: false,
              underline: true
            }
          ]
        }
      ]
    }
  ], 'parse()');
  update(elm1);
  t.equal(elm1.innerHTML,
    '<p>foo<span style="text-decoration: underline;">bar</span></p>', 'add underline');
  update2(elm1);
  t.equal(elm1.innerHTML, '<p>foobar</p>');

  var elm2 = createElement(
    '<p style="text-decoration: underline">some text</p>');
  update(elm2);
  t.equal(elm2.innerHTML,
    '<p><span style="text-decoration: underline;">some text</span></p>');

  t.end();
});

function createElement (str) {
  var elm = document.createElement('div');
  elm.innerHTML = str;
  return elm;
}
