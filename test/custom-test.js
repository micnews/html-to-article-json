const test = require('tape');
const VNode = require('virtual-dom').VNode;
const setupUpdate = require('../src/index');
const setupParse = require('../src/parse');

test('custom text formattings: add underline span-type', function (t) {
  const opts1 = {
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
  const update = setupUpdate(opts1);
  const update2 = setupUpdate({
    saveSelection: false
  });

  const parse = setupParse(opts1);

  const elm1 = createElement(
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

  const elm2 = createElement(
    '<p style="text-decoration: underline">some text</p>');
  update(elm2);
  t.equal(elm2.innerHTML,
    '<p><span style="text-decoration: underline;">some text</span></p>');

  t.end();
});

test('custom rich type', function (t) {
  const opts = {
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
        const foo = elm.getElementsByTagName('foo')[0];
        return {
          type: 'rich',
          category: 'foo',
          bar: foo.getAttribute('bar')
        };
      }
    }]
  };
  const update = setupUpdate(opts);
  const elm1 = document.body.appendChild(document.createElement('div'));
  elm1.innerHTML = '<foo bar="bas"></foo>';
  update(elm1);
  const expected = '<figure>' +
      '<foo bar="bas"></foo>' +
    '</figure>';
  t.equal(elm1.innerHTML, expected);
  t.end();
});

test('custom rich type that extend existing with special render', function (t) {
  const opts = {
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
  const update = setupUpdate(opts);
  const elm = document.body.appendChild(document.createElement('div'));
  const img = elm.appendChild(document.createElement('img'));
  img.setAttribute('src', 'http://example.com/image.jpg');
  update(elm);
  t.equal(elm.innerHTML,
    '<figure><img src="http://example.com/image.jpg" class="custom-image-class"></figure>');
  t.end();
});

function createElement (str) {
  const elm = document.createElement('div');
  elm.innerHTML = str;
  return elm;
}
