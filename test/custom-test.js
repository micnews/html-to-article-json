import test from './tape-wrapper';
import setupParse from '../lib';

test('custom text formattings: add underline span-type', t => {
  const opts = {
    customTextFormattings: [{
      property: 'underline',
      get: elm => elm.tagName && elm.style.textDecoration === 'underline' || false
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
          mark: false,
          markClass: null,
          content: 'foo',
          href: null,
          italic: false,
          bold: false,
          strikethrough: false,
          underline: false
        },
        {
          type: 'text',
          mark: false,
          markClass: null,
          content: 'bar',
          href: null,
          italic: false,
          bold: false,
          strikethrough: false,
          underline: true
        }
      ]
    }
  ];

  t.same(actual, expected, 'parse()');
});

test('custom embed type', t => {
  const opts = {
    customEmbedTypes: [{
      embedType: 'foo',
      parse: elm => {
        const foo = elm.childNodes[0];
        return {
          type: 'embed',
          embedType: 'foo',
          bar: foo.getAttribute('bar'),
          caption: []
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
  t.same(actual, expected);
});

test('multiple custom embeds', t => {
  const opts = {
    customEmbedTypes: [{
      embedType: 'foo',
      parse: elm => {
        const foo = elm.childNodes[0];
        if (foo) {
          return {
            type: 'embed',
            embedType: 'foo',
            bar: foo.getAttribute('bar'),
            caption: []
          };
        }
      }
    }, {
      embedType: 'bar',
      parse: elm => {
        console.log(elm);
        if (elm.tagName === 'bar') {
          return {
            type: 'embed',
            embedType: 'bar',
            beep: 'boop',
            caption: []
          };
        }
      }
    }]
  };
  const html = '<div><foo bar="bas"></foo></div><bar/>';
  const parse = setupParse(opts);

  const expected = [{
    bar: 'bas',
    caption: [],
    type: 'embed',
    embedType: 'foo'
  }, {
    type: 'embed',
    embedType: 'bar',
    beep: 'boop',
    caption: []
  }];
  const actual = parse(html);
  t.same(actual, expected);
});

test('custom embed type extend existing type', t => {
  const opts = {
    customEmbedTypes: [{
      embedType: 'image',
      parse: elm => {
        const img = elm.childNodes[0];
        return {
          type: 'embed',
          embedType: 'image',
          bar: img.getAttribute('bar'),
          caption: []
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
  t.same(actual, expected);
});
