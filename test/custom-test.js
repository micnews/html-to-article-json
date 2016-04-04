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

  t.same(actual, expected, 'parse()');
});
