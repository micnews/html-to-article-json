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

test('parse() youtube iframe', t => {
  const input = `<iframe src="https://www.youtube.com/embed/pDVmldTurqk"></iframe>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'youtube',
    caption: [],
    youtubeId: 'pDVmldTurqk'
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() youtube embedly iframe', t => {
  const input = `<iframe
    src="//cdn.embedly.com/widgets/media.html?src=http%3A%2F%2Fwww.youtube.com%2Fembed%2F3rS6mZUo3fg%3Ffeature%3Doembed"
  ></iframe>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'youtube',
    caption: [],
    youtubeId: '3rS6mZUo3fg'
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() figure + youtube iframe', t => {
  const input = `<figure>
    <iframe src="https://www.youtube.com/embed/pDVmldTurqk"></iframe>
    <figcaption>Hello, <b>world</b></figcaption>
  </figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'youtube',
    caption: [
      { bold: false, content: 'Hello, ', href: null, italic: false, type: 'text' },
      { bold: true, content: 'world', href: null, italic: false, type: 'text' }
    ],
    youtubeId: 'pDVmldTurqk'
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() tweet - normal', t => {
  const input = `<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">GIF vs. JIF… This <a href="https://t.co/qFAHWgdbL6">pic.twitter.com/qFAHWgdbL6</a></p>&mdash; Matt (foo) Navarra (@MattNavarra) <a href="https://twitter.com/MattNavarra/status/684690494841028608">January 6, 2016</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'twitter',
    caption: [],
    text: [
      { content: 'GIF vs. JIF… This ', href: null },
      { content: 'pic.twitter.com/qFAHWgdbL6', href: 'https://t.co/qFAHWgdbL6' }
    ],
    url: 'https://twitter.com/MattNavarra/status/684690494841028608',
    date: 'January 6, 2016',
    user: {
      slug: 'MattNavarra',
      name: 'Matt (foo) Navarra'
    },
    id: '684690494841028608'
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() tweet - weird input', t => {
  const input = `<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">foo bar<beep>boop</beep></p>&mdash; Matt Navarra (@MattNavarra) <a href="https://twitter.com/MattNavarra/status/684690494841028608">January 6, 2016</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  const actual = parse(input)[0].text;
  const expected = [
    { content: 'foo bar', href: null }
  ];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() tweet - no paragraph, no user', t => {
  const input = `<blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/MattNavarra/status/684690494841028608">January 6, 2016</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'twitter',
    caption: [],
    text: [],
    url: 'https://twitter.com/MattNavarra/status/684690494841028608',
    date: 'January 6, 2016',
    user: {
      slug: null,
      name: null
    },
    id: '684690494841028608'
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() tweet - no id', t => {
  const input = `<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">GIF vs. JIF… This <a href="https://t.co/qFAHWgdbL6">pic.twitter.com/qFAHWgdbL6</a></p>&mdash; Matt (foo) Navarra (@MattNavarra) </blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  const actual = parse(input);
  t.notEqual(actual[0].type, 'embed');
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
