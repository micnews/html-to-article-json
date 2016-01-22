const test = require('tape');
const setupParse = require('../lib');

test('custom text formattings: add underline span-type', function (t) {
  const opts = {
    customTextFormattings: [{
      property: 'underline',
      get: function (elm) {
        return elm.tagName && elm.style.textDecoration === 'underline' || false;
      }
    }]
  };

  const parse = setupParse(opts);

  const html = '<p>foo<span style="text-decoration: underline">bar</span></p>';

  const actual = parse(html);
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

test('custom embed type', function (t) {
  const opts = {
    customEmbedTypes: [{
      embedType: 'foo',
      parse: function (elm) {
        const foo = elm.childNodes[0];
        return {
          type: 'embed',
          embedType: 'foo',
          bar: foo.getAttribute('bar')
        };
      }
    }]
  };
  const html = '<div><foo bar="bas"></foo></div>';
  const parse = setupParse(opts);

  const expected = [{
    bar: 'bas',
    caption: [],
    type: 'embed',
    embedType: 'foo'
  }];
  const actual = parse(html);
  t.deepEqual(actual, expected);
  t.end();
});

test('custom embed type extend existing type', function (t) {
  const opts = {
    customEmbedTypes: [{
      embedType: 'image',
      parse: function (elm) {
        const img = elm.childNodes[0];
        return {
          type: 'embed',
          embedType: 'image',
          bar: img.getAttribute('bar')
        };
      }
    }]
  };
  const html = '<div><img bar="bas"></img></div>';
  const parse = setupParse(opts);

  const expected = [{
    bar: 'bas',
    caption: [],
    type: 'embed',
    embedType: 'image'
  }];
  const actual = parse(html);
  t.deepEqual(actual, expected);
  t.end();
});
