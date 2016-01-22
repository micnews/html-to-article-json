const test = require('tape');
const setupParse = require('../src');

test('custom text formattings: add underline span-type', function (t) {
  const opts = {
    customTextFormattings: [{
      property: 'underline',
      get: function (elm) {
        return elm.nodeType === 1 && elm.style.textDecoration === 'underline';
      }
    }]
  };

  const parse = setupParse(opts);

  const elm1 = createElement(
    '<p>foo<span style="text-decoration: underline">bar</span></p>');

  const actual = parse(elm1);
  const expected = [
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
  ];

  t.deepEqual(actual, expected, 'parse()');

  t.end();
});

test('custom rich type', function (t) {
  const opts = {
    customRichTypes: [{
      richType: 'foo',
      parse: function (elm) {
        const foo = elm.getElementsByTagName('foo')[0];
        return {
          type: 'rich',
          richType: 'foo',
          bar: foo.getAttribute('bar')
        };
      }
    }]
  };
  const elm = document.body.appendChild(document.createElement('div'));
  elm.innerHTML = '<foo bar="bas"></foo>';
  const parse = setupParse(opts);

  const expected = [{
    bar: 'bas',
    caption: [],
    type: 'rich',
    richType: 'foo'
  }];
  const actual = parse(elm);
  t.deepEqual(actual, expected);
  t.end();
});

test('custom rich type extend existing type', function (t) {
  const opts = {
    customRichTypes: [{
      richType: 'image',
      parse: function (elm) {
        const img = elm.getElementsByTagName('img')[0];
        return {
          type: 'rich',
          richType: 'image',
          bar: img.getAttribute('bar')
        };
      }
    }]
  };
  const elm = document.body.appendChild(document.createElement('div'));
  elm.innerHTML = '<img bar="bas"></img>';
  const parse = setupParse(opts);

  const expected = [{
    bar: 'bas',
    caption: [],
    type: 'rich',
    richType: 'image'
  }];
  const actual = parse(elm);
  t.deepEqual(actual, expected);
  t.end();
});

function createElement (str) {
  const elm = document.createElement('div');
  elm.innerHTML = str;
  return elm;
}
