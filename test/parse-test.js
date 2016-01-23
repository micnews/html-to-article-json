import test from 'tape';
import setupParse from '../lib/parse';
import tsml from 'tsml';

const parse = setupParse({});

test('parse() single block element node', t => {
  const actual = parse('<p></p>');
  const expected = [{ type: 'paragraph', children: [] }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() single inline element node', t => {
  const actual = parse('<span></span>');
  const expected = [];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() text in span', t => {
  const actual = parse('<span>beep boop</span>');
  const expected = [{
    bold: false,
    content: 'beep boop',
    href: null,
    italic: false,
    type: 'text'
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() img', t => {
  const actual = parse('<img src="http://example.com/image.jpg" />');
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [],
    src: 'http://example.com/image.jpg'
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() img, with alt-attribute', t => {
  const actual = parse('<img src="http://example.com/image.jpg" alt="beep boop" />');
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [
      { content: 'beep boop', type: 'text' }
    ],
    src: 'http://example.com/image.jpg'
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() figure + img', t => {
  const input = tsml`<figure>
    <img src="http://example.com/image.jpg"/>
    <figcaption>Hello, <b>world</b></figcaption>
  </figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [
      { bold: false, content: 'Hello, ', href: null, italic: false, type: 'text' },
      { bold: true, content: 'world', href: null, italic: false, type: 'text' }
    ],
    src: 'http://example.com/image.jpg'
  }];

  t.deepEqual(actual, expected);
  t.end();
});

test('parse() figure + img but no figcaption', t => {
  const input = tsml`<figure>
    <img src="http://example.com/image.jpg"/>
  </figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [],
    src: 'http://example.com/image.jpg'
  }];

  t.deepEqual(actual, expected);
  t.end();
});

test('parse() figure with unkown content', t => {
  const input = tsml`<figure></figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'block',
    children: []
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() figure + img and figcaption with no content', t => {
  const input = tsml`<figure>
    <img src="http://example.com/image.jpg"/>
    <figcaption></figcaption>
  </figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [],
    src: 'http://example.com/image.jpg'
  }];

  t.deepEqual(actual, expected);
  t.end();
});

test('parse() video with src', t => {
  const input = '<video src="http://example.com/video.mp4" />';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'video',
    caption: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }]
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() video with sources', t => {
  const input = tsml`<video>
    <source src="http://example.com/video.mp4" />
    <source src="http://example.com/video2.mp4" type="video/mp4"/>
  </video>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'video',
    caption: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }, {
      src: 'http://example.com/video2.mp4',
      type: 'video/mp4'
    }]
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() figure + video with src', t => {
  const input = '<figure><video src="http://example.com/video.mp4" /></figure>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'video',
    caption: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }]
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() figure + video with sources', t => {
  const input = tsml`<figure>
    <video>
      <source src="http://example.com/video.mp4" />
      <source src="http://example.com/video2.mp4" type="video/mp4"/>
    </video>
  </figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'video',
    caption: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }, {
      src: 'http://example.com/video2.mp4',
      type: 'video/mp4'
    }]
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() figure + video with src & figcaption', t => {
  const input = `<figure>
    <video src="http://example.com/video.mp4"></video>
    <figcaption>Hello, <b>world</b></figcaption>
  </figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'video',
    caption: [
      { bold: false, content: 'Hello, ', href: null, italic: false, type: 'text' },
      { bold: true, content: 'world', href: null, italic: false, type: 'text' }
    ],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }]
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() tricky link', t => {
  const input = '<p><i>This is italic and <a href="http://link4.com/">this is a link</i> foo bar</a></p>';
  const actual = parse(input);
  const expected = [{
    type: 'paragraph',
    children: [
      {
        type: 'text',
        content: 'This is italic and ',
        href: null,
        italic: true,
        bold: false
      },
      {
        type: 'text',
        content: 'this is a link',
        href: 'http://link4.com/',
        italic: true,
        bold: false
      },
      {
        type: 'text',
        content: ' foo bar',
        href: 'http://link4.com/',
        italic: false,
        bold: false
      }
    ]
  }
];

  t.deepEqual(actual, expected);

  t.end();
});
