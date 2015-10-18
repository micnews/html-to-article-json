'use strict';

var test = require('tape');
var VNode = require('virtual-dom').VNode;
var setupUpdate = require('../src/index');
var setupParse = require('../src/parse');

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
      type: 'block',
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

test('custom rich type', function (t) {
  var opts = {
    saveSelection: false,
    customRichTypes: [{
      category: 'foo',
      render: function (obj) {
        return new VNode('foo', {
          attributes: {
            bar: obj.bar
          }
        });
      },
      parse: function (elm) {
        var foo = elm.getElementsByTagName('foo')[0];
        return {
          type: 'rich',
          category: 'foo',
          bar: foo.getAttribute('bar')
        };
      }
    }]
  };
  var update = setupUpdate(opts);
  var elm1 = document.body.appendChild(document.createElement('div'));
  elm1.innerHTML = '<foo bar="bas"></foo>';
  update(elm1);
  var expected = '<figure>' +
      '<foo bar="bas"></foo>' +
    '</figure>';
  t.equal(elm1.innerHTML, expected);
  t.end();
});

test('custom rich type that extend existing with special render', function (t) {
  var opts = {
    saveSelection: false,
    customRichTypes: [{
      category: 'image',
      render: function (obj) {
        return new VNode('img', {
          attributes: {
            src: obj.src,
            alt: obj.alt,
            class: 'custom-image-class'
          }
        });
      }
      // no parse needed since the existing parse will be used. Pretty neat!
    }]
  };
  var update = setupUpdate(opts);
  var elm = document.body.appendChild(document.createElement('div'));
  var img = elm.appendChild(document.createElement('img'));
  img.setAttribute('src', 'http://example.com/image.jpg');
  update(elm);
  t.equal(elm.innerHTML,
    '<figure><img src="http://example.com/image.jpg" class="custom-image-class"></figure>');
  t.end();
});

function createElement (str) {
  var elm = document.createElement('div');
  elm.innerHTML = str;
  return elm;
}
