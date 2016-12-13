import test from './tape-wrapper';
import setupParse from '../lib';
import tsml from 'tsml';

test('parse() parseFigureProps, no match', t => {
  const opts = {
    parseFigureProps: ['class', 'id']
  };

  const parse = setupParse(opts);

  const input = tsml`<figure>
    <img src="http://example.com/image.jpg"/>
  </figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [],
    attribution: [],
    src: 'http://example.com/image.jpg',
    width: '',
    height: '',
    figureProps: {}
  }];

  t.same(actual, expected);
});

test('parse() parseFigureProps, only return specified attribute', t => {
  const opts = {parseFigureProps: ['class']};
  const parse = setupParse(opts);

  const input = tsml`<figure class='beep' id='boop'>
    <img src="http://example.com/image.jpg"/>
  </figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [],
    attribution: [],
    src: 'http://example.com/image.jpg',
    width: '',
    height: '',
    figureProps: {
      class: 'beep'
    }
  }];

  t.same(actual, expected);
});

test('parse() parseFigureProps, no match but other attributes on element', t => {
  const opts = {parseFigureProps: ['class']};
  const parse = setupParse(opts);

  const input = '<figure id="boop"><img src="http://example.com/image.jpg"/></figure>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [],
    attribution: [],
    src: 'http://example.com/image.jpg',
    width: '',
    height: '',
    figureProps: {}
  }];

  t.same(actual, expected);
});
