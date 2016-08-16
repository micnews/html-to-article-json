import test from './tape-wrapper';
import setupParse from '../lib/parse';
import tsml from 'tsml';

const _parse = setupParse({});
const parse = process.browser
  ? (html) => {
    const node = document.createElement('div');
    node.innerHTML = html;
    return _parse(node.childNodes);
  }
  : _parse;

test('parse() single block element node', t => {
  const actual = parse('<p></p>');
  const expected = [{ type: 'paragraph', children: [] }];
  t.same(actual, expected);
});

test('parse() single inline element node', t => {
  const actual = parse('<span></span>');
  const expected = [];
  t.same(actual, expected);
});

test('parse() text in span', t => {
  const actual = parse('<span>beep boop</span>');
  const expected = [{
    bold: false,
    content: 'beep boop',
    href: null,
    italic: false,
    type: 'text',
    mark: false,
    markClass: null,
    strikethrough: false
  }];
  t.same(actual, expected);
});

test('parse() img', t => {
  const actual = parse('<img src="http://example.com/image.jpg" />');
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [],
    attribution: [],
    src: 'http://example.com/image.jpg',
    width: null,
    height: null
  }];
  t.same(actual, expected);
});

test('parse() img, with alt-attribute', t => {
  const actual = parse('<img src="http://example.com/image.jpg" alt="beep boop" />');
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [
      { content: 'beep boop', type: 'text' }
    ],
    attribution: [],
    src: 'http://example.com/image.jpg',
    width: null,
    height: null
  }];
  t.same(actual, expected);
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
      { bold: false, content: 'Hello, ', href: null, italic: false, strikethrough: false, type: 'text', mark: false, markClass: null },
      { bold: true, content: 'world', href: null, italic: false, strikethrough: false, type: 'text', mark: false, markClass: null }
    ],
    attribution: [],
    src: 'http://example.com/image.jpg',
    width: null,
    height: null
  }];

  t.same(actual, expected);
});

test('parse() figure + img + multiple figcaptions', t => {
  const input = tsml`<figure>
    <img src="http://example.com/image.jpg"/>
    <figcaption>Hello,</figcaption>
    <figcaption><b>world</b></figcaption>
  </figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [
      { bold: false, content: 'Hello,', href: null, italic: false, strikethrough: false, type: 'text', mark: false, markClass: null },
      { bold: true, content: 'world', href: null, italic: false, strikethrough: false, type: 'text', mark: false, markClass: null }
    ],
    attribution: [],
    src: 'http://example.com/image.jpg',
    width: null,
    height: null
  }];

  t.same(actual, expected);
});

test('parse() figure + img + figcaption + cite', t => {
  const input = tsml`<figure>
    <img src="http://example.com/image.jpg"/>
    <figcaption>Hello, world<cite><a href="http://example.com">author</a></cite></figcaption>
  </figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [
      { bold: false, content: 'Hello, world', href: null, italic: false, strikethrough: false, type: 'text', mark: false, markClass: null }
    ],
    attribution: [
      { bold: false, content: 'author', href: 'http://example.com', italic: false, strikethrough: false, type: 'text', mark: false, markClass: null }
    ],
    src: 'http://example.com/image.jpg',
    width: null,
    height: null
  }];

  t.same(actual, expected);
});

test('parse() figure + img + figcaption + cite without anchor tag', t => {
  const input = tsml`<figure>
    <img src="http://example.com/image.jpg"/>
    <figcaption>Hello, world<cite>author</a></figcaption>
  </figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [
      { bold: false, content: 'Hello, world', href: null, italic: false, strikethrough: false, type: 'text', mark: false, markClass: null }
    ],
    attribution: [
      { bold: false, content: 'author', href: null, italic: false, strikethrough: false, type: 'text', mark: false, markClass: null }
    ],
    src: 'http://example.com/image.jpg',
    width: null,
    height: null
  }];

  t.same(actual, expected);
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
    attribution: [],
    src: 'http://example.com/image.jpg',
    width: null,
    height: null
  }];

  t.same(actual, expected);
});

test('parse() img with width & height', t => {
  const input = tsml`<img src="http://example.com/image.jpg" width="100" height="200" />`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [],
    attribution: [],
    src: 'http://example.com/image.jpg',
    width: 100,
    height: 200
  }];

  t.same(actual, expected);
});

test('parse() img with width & height css', t => {
  const input = tsml`<img src="http://example.com/image.jpg" style="width: 100px; height: 200px" />`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [],
    attribution: [],
    src: 'http://example.com/image.jpg',
    width: 100,
    height: 200
  }];

  t.same(actual, expected);
});

test('parse() figure with no content', t => {
  const input = tsml`<figure></figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'block',
    children: []
  }];
  t.same(actual, expected);
});

test('parse() figure with unknown content', t => {
  const input = tsml`<figure><div>beep</div></figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'block',
    children: [{
      type: 'block',
      children: [{
        type: 'text',
        mark: false,
        markClass: null,
        content: 'beep',
        href: null,
        italic: false,
        strikethrough: false,
        bold: false
      }]
    }]
  }];
  t.same(actual, expected);
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
    attribution: [],
    src: 'http://example.com/image.jpg',
    width: null,
    height: null
  }];

  t.same(actual, expected);
});

test('parse() video with src', t => {
  const input = '<video src="http://example.com/video.mp4" />';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'video',
    caption: [],
    attribution: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }],
    width: null,
    height: null
  }];
  t.same(actual, expected);
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
    attribution: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }, {
      src: 'http://example.com/video2.mp4',
      type: 'video/mp4'
    }],
    width: null,
    height: null
  }];
  t.same(actual, expected);
});

test('parse() video with width & height', t => {
  const input = '<video src="http://example.com/video.mp4" width="100" height="200" />';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'video',
    caption: [],
    attribution: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }],
    width: 100,
    height: 200
  }];
  t.same(actual, expected);
});

test('parse() video with width & height css', t => {
  const input = '<video src="http://example.com/video.mp4" style="width:100px;height:200px" />';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'video',
    caption: [],
    attribution: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }],
    width: 100,
    height: 200
  }];
  t.same(actual, expected);
});

test('parse() figure + video with src', t => {
  const input = '<figure><video src="http://example.com/video.mp4" /></figure>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'video',
    caption: [],
    attribution: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }],
    width: null,
    height: null
  }];
  t.same(actual, expected);
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
    attribution: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }, {
      src: 'http://example.com/video2.mp4',
      type: 'video/mp4'
    }],
    width: null,
    height: null
  }];
  t.same(actual, expected);
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
      { bold: false, content: 'Hello, ', href: null, italic: false, strikethrough: false, type: 'text', mark: false, markClass: null },
      { bold: true, content: 'world', href: null, italic: false, strikethrough: false, type: 'text', mark: false, markClass: null }
    ],
    attribution: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }],
    width: null,
    height: null
  }];
  t.same(actual, expected);
});

test('parse() youtube iframe', t => {
  const input = '<iframe src="https://www.youtube.com/embed/pDVmldTurqk"></iframe>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'youtube',
    caption: [],
    attribution: [],
    youtubeId: 'pDVmldTurqk'
  }];
  t.same(actual, expected);
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
    attribution: [],
    youtubeId: '3rS6mZUo3fg'
  }];
  t.same(actual, expected);
});

test('parse() figure + youtube iframe', t => {
  const input = '<figure><iframe src="https://www.youtube.com/embed/pDVmldTurqk"></iframe><figcaption>Hello, <b>world</b></figcaption></figure>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'youtube',
    caption: [
      { bold: false, content: 'Hello, ', href: null, italic: false, strikethrough: false, type: 'text', mark: false, markClass: null },
      { bold: true, content: 'world', href: null, italic: false, strikethrough: false, type: 'text', mark: false, markClass: null }
    ],
    attribution: [],
    youtubeId: 'pDVmldTurqk'
  }];
  t.same(actual, expected);
});

test('parse() tweet - normal', t => {
  const input = '<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">GIF vs. JIF… This <a href="https://t.co/qFAHWgdbL6">pic.twitter.com/qFAHWgdbL6</a></p>&mdash; Matt (foo) Navarra (@MattNavarra) <a href="https://twitter.com/MattNavarra/status/684690494841028608">January 6, 2016</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'twitter',
    embedAs: 'tweet',
    caption: [],
    attribution: [],
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
  t.same(actual, expected);
});

test('parse() tweet - video', t => {
  const input = '<blockquote class="twitter-video" lang="en"><p lang="en" dir="ltr">GIF vs. JIF… This <a href="https://t.co/qFAHWgdbL6">pic.twitter.com/qFAHWgdbL6</a></p>&mdash; Matt (foo) Navarra (@MattNavarra) <a href="https://twitter.com/MattNavarra/status/684690494841028608">January 6, 2016</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'twitter',
    embedAs: 'video',
    caption: [],
    attribution: [],
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
  t.same(actual, expected);
});

test('parse() tweet - no date', t => {
  const input = '<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">GIF vs. JIF… This <a href="https://t.co/qFAHWgdbL6">pic.twitter.com/qFAHWgdbL6</a></p>&mdash; Matt (foo) Navarra (@MattNavarra) <a href="https://twitter.com/MattNavarra/status/684690494841028608"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'twitter',
    embedAs: 'tweet',
    caption: [],
    attribution: [],
    text: [
      { content: 'GIF vs. JIF… This ', href: null },
      { content: 'pic.twitter.com/qFAHWgdbL6', href: 'https://t.co/qFAHWgdbL6' }
    ],
    url: 'https://twitter.com/MattNavarra/status/684690494841028608',
    date: '',
    user: {
      slug: 'MattNavarra',
      name: 'Matt (foo) Navarra'
    },
    id: '684690494841028608'
  }];
  t.same(actual, expected);
});

test('parse() tweet - weird input', t => {
  const input = '<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">foo bar<beep>boop</beep></p>&mdash; Matt Navarra (@MattNavarra) <a href="https://twitter.com/MattNavarra/status/684690494841028608">January 6, 2016</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
  const actual = parse(input)[0].text;
  const expected = [
    { content: 'foo bar', href: null }
  ];
  t.same(actual, expected);
});

test('parse() tweet - no paragraph, no user', t => {
  const input = '<blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/MattNavarra/status/684690494841028608">January 6, 2016</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'twitter',
    embedAs: 'tweet',
    caption: [],
    attribution: [],
    text: [],
    url: 'https://twitter.com/MattNavarra/status/684690494841028608',
    date: 'January 6, 2016',
    user: {
      slug: null,
      name: null
    },
    id: '684690494841028608'
  }];
  t.same(actual, expected);
});

test('parse() tweet - no id', t => {
  const input = '<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">GIF vs. JIF… This <a href="https://t.co/qFAHWgdbL6">pic.twitter.com/qFAHWgdbL6</a></p>&mdash; Matt (foo) Navarra (@MattNavarra) </blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
  const actual = parse(input);
  t.not(actual[0].type, 'embed');
});

test('parse() instagram - with caption', t => {
  const input = '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/-7PIhyA6J3/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">Reinsta @karinn In Berlin. Feeling awesome.</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by David Björklund (@david_bjorklund) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2015-12-05T21:40:53+00:00">Dec 5, 2015 at 1:40pm PST</time></p></div></blockquote><script async defer src="//platform.instagram.com/en_US/embeds.js"></script>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'instagram',
    caption: [],
    attribution: [],
    id: '-7PIhyA6J3',
    url: 'https://www.instagram.com/p/-7PIhyA6J3/',
    text: 'Reinsta @karinn In Berlin. Feeling awesome.',
    date: {string: 'Dec 5, 2015 at 1:40pm PST', utc: '2015-12-05T21:40:53+00:00'},
    user: {name: 'David Björklund', slug: 'david_bjorklund'}
  }];
  t.same(actual, expected);
});

test('parse() instagram figure iframe', t => {
  const input = tsml`
    <figure contenteditable="false" class="embeddable clearfix embeddable-instagram" id="embeddable-km0e0eo" data-type="instagram">
      <div class="embeddable-container">
        <iframe src="http://instagram.com/p/fdx1CSuEPV/embed"></iframe>
      </div>
    </figure>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'instagram',
    text: '',
    id: 'fdx1CSuEPV',
    url: 'https://instagram.com/p/fdx1CSuEPV',
    caption: [],
    attribution: [],
    date: null,
    user: null
  }];
  t.same(actual, expected);
});

test('parse() instagram - without caption', t => {
  const input = '<blockquote class="instagram-media" data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/-7PIhyA6J3/" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A photo posted by David Björklund (@david_bjorklund)</a> on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2015-12-05T21:40:53+00:00">Dec 5, 2015 at 1:40pm PST</time></p></div></blockquote><script async defer src="//platform.instagram.com/en_US/embeds.js"></script>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'instagram',
    caption: [],
    attribution: [],
    id: '-7PIhyA6J3',
    url: 'https://www.instagram.com/p/-7PIhyA6J3/',
    text: null,
    date: {
      string: 'Dec 5, 2015 at 1:40pm PST',
      utc: '2015-12-05T21:40:53+00:00'
    },
    user: {
      name: 'David Björklund',
      slug: 'david_bjorklund'
    }
  }];
  t.same(actual, expected);
});

test('parse() instagram - bad input', t => {
  const input = '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></blockquote>';
  const actual = parse(input);
  const expected = [{ children: [], type: 'blockquote' }];
  t.same(actual, expected);
});

test('parse() facebook - post', t => {
  const input = '<div id="fb-root"></div><script>(function(d, s, id) {  var js, fjs = d.getElementsByTagName(s)[0];  if (d.getElementById(id)) return;  js = d.createElement(s); js.id = id;  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3";  fjs.parentNode.insertBefore(js, fjs);}(document, \'script\', \'facebook-jssdk\'));</script><div class="fb-post" data-href="https://www.facebook.com/david.bjorklund/posts/10153809692501070" data-width="500"><div class="fb-xfbml-parse-ignore"><blockquote cite="https://www.facebook.com/david.bjorklund/posts/10153809692501070"><p>Hey!So, for the last few weeks I&#039;ve worked on http://mic.com/ - the new home for mic.com (on desktop) - please take a look :)</p>Posted by <a href="#" role="button">David Pop Hipsterson</a> on&nbsp;<a href="https://www.facebook.com/david.bjorklund/posts/10153809692501070">Thursday, January 21, 2016</a></blockquote></div></div>';
  const actual = parse(input);
  const expected = [
    {
      type: 'block',
      children: []
    },
    {
      url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070',
      caption: [],
      attribution: [],
      type: 'embed',
      embedType: 'facebook',
      embedAs: 'post',
      date: 'Thursday, January 21, 2016',
      headline: null,
      text: [{
        content: 'Hey!So, for the last few weeks I\'ve worked on http://mic.com/ - the new home for mic.com (on desktop) - please take a look :)',
        href: null
      }],
      user: 'David Pop Hipsterson'
    }
  ];
  t.same(actual, expected);
});

test('parse() facebook - video', t => {
  const input = '<div id="fb-root"></div><script>(function(d, s, id) {  var js, fjs = d.getElementsByTagName(s)[0];  if (d.getElementById(id)) return;  js = d.createElement(s); js.id = id;  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3";  fjs.parentNode.insertBefore(js, fjs);}(document, \'script\', \'facebook-jssdk\'));</script><div class="fb-video" data-allowfullscreen="1" data-href="https://www.facebook.com/MicMedia/videos/1060315987324524/"><div class="fb-xfbml-parse-ignore"><blockquote cite="https://www.facebook.com/MicMedia/videos/1060315987324524/"><a href="https://www.facebook.com/MicMedia/videos/1060315987324524/">Why is breastfeeding in public such a big deal?</a><p>Men and women *both* have nipples — so why do we only shame women for showing theirs... especially when they&#039;re breastfeeding?</p>Posted by <a href="https://www.facebook.com/MicMedia/">Mic</a> on Friday, January 15, 2016</blockquote></div></div>';
  const actual = parse(input);
  const expected = [
    {
      type: 'block',
      children: []
    },
    {
      url: 'https://www.facebook.com/MicMedia/videos/1060315987324524/',
      caption: [],
      attribution: [],
      type: 'embed',
      embedType: 'facebook',
      embedAs: 'video',
      date: 'Friday, January 15, 2016',
      headline: 'Why is breastfeeding in public such a big deal?',
      text: [{
        content: 'Men and women *both* have nipples — so why do we only shame women for showing theirs... especially when they\'re breastfeeding?',
        href: null
      }],
      user: { name: 'Mic', url: 'https://www.facebook.com/MicMedia/' }
    }
  ];
  t.same(actual, expected);
});

test('parse() vine', t => {
  const input = '<iframe src="https://vine.co/v/bjHh0zHdgZT/embed/simple" width="600" height="600" frameborder="0"></iframe><script src="https://platform.vine.co/static/scripts/embed.js"></script>';
  const actual = parse(input);
  const expected = [{
    id: 'bjHh0zHdgZT',
    caption: [],
    attribution: [],
    type: 'embed',
    embedType: 'vine',
    url: 'https://vine.co/v/bjHh0zHdgZT/embed/simple'
  }];
  t.same(actual, expected);
});

test('parse() spotify', t => {
  const input = '<iframe src="https://embed.spotify.com/?uri=spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf" width="200" height="100" frameborder="0"></iframe>';
  const actual = parse(input);
  const expected = [{
    spotifyUri: 'spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf',
    caption: [],
    attribution: [],
    width: 200,
    height: 100,
    type: 'embed',
    embedType: 'spotify',
    url: 'https://embed.spotify.com/?uri=spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf'
  }];
  t.same(actual, expected);
});

test('parse() vine embedly', t => {
  const input = '<iframe class="embedly-embed" src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fvine.co%2Fv%2FbjHh0zHdgZT%2Fembed%2Fsimple&amp;url=https%3A%2F%2Fvine.co%2Fv%2FbjHh0zHdgZT%2Fembed%2Fsimple&amp;image=https%3A%2F%2Fv.cdn.vine.co%2Fr%2Fthumbs%2F8B474922-0D0E-49AD-B237-6ED46CE85E8A-118-000000FFCD48A9C5_1.0.6.mp4.jpg%3FversionId%3D5mzXl2DXYBvKvF9rhcp.nvEJC.1N86RG&amp;key=25bf3602073943478e54668402a4f5a8&amp;type=text%2Fhtml&amp;schema=vine" width="600" height="600" scrolling="no" frameborder="0" allowfullscreen=""></iframe>';
  const actual = parse(input);
  const expected = [{
    id: 'bjHh0zHdgZT',
    caption: [],
    attribution: [],
    type: 'embed',
    embedType: 'vine',
    url: 'https://vine.co/v/bjHh0zHdgZT/embed/simple'
  }];
  t.same(actual, expected);
});

test('parse() iframe no src', t => {
  const input = '<iframe class="embedly-embed" width="600" height="600" scrolling="no" frameborder="0" allowfullscreen=""></iframe>';
  const actual = parse(input);
  const expected = [];
  t.same(actual, expected);
});

test('parse() tumblr post', t => {
  const input = '<div class="tumblr-post" data-href="https://embed.tumblr.com/embed/post/8_SX4ALNOf1fYyEcjq78YQ/147291233392" data-did="7c08ba46cb75162284770cdee2a59365891a5e18"><a href="http://jencita.tumblr.com/post/147291233392/tswiftdaily-taylor-swift-at-lady-cilento">http://jencita.tumblr.com/post/147291233392/tswiftdaily-taylor-swift-at-lady-cilento</a></div><script async src="https://secure.assets.tumblr.com/post.js"></script>';
  const actual = parse(input);
  const expected = [{
    caption: [],
    type: 'embed',
    embedType: 'tumblr',
    did: '7c08ba46cb75162284770cdee2a59365891a5e18',
    url: 'https://embed.tumblr.com/embed/post/8_SX4ALNOf1fYyEcjq78YQ/147291233392',
    text: [{
      content: 'http://jencita.tumblr.com/post/147291233392/tswiftdaily-taylor-swift-at-lady-cilento',
      href: 'http://jencita.tumblr.com/post/147291233392/tswiftdaily-taylor-swift-at-lady-cilento'
    }]
  }];
  t.same(actual, expected);
});

test('parse() custom embed', t => {
  const input = '<iframe src="http://custom.com" width="600" height="600" frameborder="0"></iframe>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'custom',
    src: 'http://custom.com',
    width: 600,
    height: 600,
    secure: false,
    caption: [],
    attribution: []
  }];
  t.same(actual, expected);
});

test('parse() custom secure embed', t => {
  const input = '<iframe src="https://custom.com" width="600" height="600" frameborder="0"></iframe>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'custom',
    src: 'https://custom.com',
    width: 600,
    height: 600,
    secure: true,
    caption: [],
    attribution: []
  }];
  t.same(actual, expected);
});

test('parse() custom secure embed with no protocol', t => {
  const input = '<iframe src="//custom.com" width="600" height="600" frameborder="0"></iframe>';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'custom',
    src: '//custom.com',
    width: 600,
    height: 600,
    secure: true,
    caption: [],
    attribution: []
  }];
  t.same(actual, expected);
});

test('parse() tricky link', t => {
  const input = '<p><i>This is italic and <a href="http://link4.com/">this is a link</i> foo bar</a></p>';
  const actual = parse(input);
  const expected = [{
    type: 'paragraph',
    children: [
      {
        type: 'text',
        mark: false,
        markClass: null,
        content: 'This is italic and ',
        href: null,
        italic: true,
        bold: false,
        strikethrough: false
      },
      {
        type: 'text',
        mark: false,
        markClass: null,
        content: 'this is a link',
        href: 'http://link4.com/',
        italic: true,
        bold: false,
        strikethrough: false
      },
      {
        type: 'text',
        mark: false,
        markClass: null,
        content: ' foo bar',
        href: 'http://link4.com/',
        italic: false,
        bold: false,
        strikethrough: false
      }
    ]
  }];

  t.same(actual, expected);
});

test('parse() mark', t => {
  const input = '<mark class="markclass">mark content</mark>';
  const actual = parse(input);
  const expected = [{
    bold: false,
    content: 'mark content',
    href: null,
    italic: false,
    type: 'text',
    mark: true,
    markClass: 'markclass',
    strikethrough: false
  }];
  t.same(actual, expected);
});

test('parse() empty mark', t => {
  const input = '<p><mark class="empty-mark-tag"></mark>Text</p>';
  const actual = parse(input);
  const expected = [{
    type: 'paragraph',
    children: [{
      bold: false,
      content: null,
      href: null,
      italic: false,
      strikethrough: false,
      mark: true,
      markClass: 'empty-mark-tag',
      type: 'text'
    }, {
      bold: false,
      content: 'Text',
      href: null,
      italic: false,
      strikethrough: false,
      mark: false,
      markClass: null,
      type: 'text'
    }]
  }];

  t.same(actual, expected);
});

test('parse() strikethrough', t => {
  const inputs = [
    '<p><s>text</s></p>',
    '<p><strike>text</strike></p>'
  ];
  const expected = [{
    type: 'paragraph',
    children: [{
      bold: false,
      content: 'text',
      href: null,
      italic: false,
      mark: false,
      markClass: null,
      type: 'text',
      strikethrough: true
    }]
  }];

  inputs.forEach(input => {
    const actual = parse(input);
    t.same(actual, expected);
  });
});
