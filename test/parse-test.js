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
    src: 'http://example.com/image.jpg',
    width: undefined,
    height: undefined
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
    src: 'http://example.com/image.jpg',
    width: undefined,
    height: undefined
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
    src: 'http://example.com/image.jpg',
    width: undefined,
    height: undefined
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
    src: 'http://example.com/image.jpg',
    width: undefined,
    height: undefined
  }];

  t.deepEqual(actual, expected);
  t.end();
});

test('parse() img with width & height', t => {
  const input = tsml`<img src="http://example.com/image.jpg" width="100" height="200" />`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [],
    src: 'http://example.com/image.jpg',
    width: 100,
    height: 200
  }];

  t.deepEqual(actual, expected);
  t.end();
});

test('parse() img with width & height css', t => {
  const input = tsml`<img src="http://example.com/image.jpg" style="width: 100; height: 200" />`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'image',
    caption: [],
    src: 'http://example.com/image.jpg',
    width: 100,
    height: 200
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
    src: 'http://example.com/image.jpg',
    width: undefined,
    height: undefined
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
    }],
    width: undefined,
    height: undefined
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
    }],
    width: undefined,
    height: undefined
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() video with width & height', t => {
  const input = '<video src="http://example.com/video.mp4" width="100" height="200" />';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'video',
    caption: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }],
    width: 100,
    height: 200
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() video with width & height css', t => {
  const input = '<video src="http://example.com/video.mp4" style="width:100;height:200" />';
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'video',
    caption: [],
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }],
    width: 100,
    height: 200
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
    }],
    width: undefined,
    height: undefined
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
    }],
    width: undefined,
    height: undefined
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
    }],
    width: undefined,
    height: undefined
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

test('parse() tweet - no date', t => {
  const input = `<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">GIF vs. JIF… This <a href="https://t.co/qFAHWgdbL6">pic.twitter.com/qFAHWgdbL6</a></p>&mdash; Matt (foo) Navarra (@MattNavarra) <a href="https://twitter.com/MattNavarra/status/684690494841028608"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
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
    date: '',
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

test('parse() instagram - with caption', t => {
  const input = `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/-7PIhyA6J3/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">Reinsta @karinn In Berlin. Feeling awesome.</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by David Björklund (@david_bjorklund) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2015-12-05T21:40:53+00:00">Dec 5, 2015 at 1:40pm PST</time></p></div></blockquote><script async defer src="//platform.instagram.com/en_US/embeds.js"></script>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'instagram',
    caption: [],
    id: '-7PIhyA6J3',
    url: 'https://www.instagram.com/p/-7PIhyA6J3/',
    text: 'Reinsta @karinn In Berlin. Feeling awesome.'
  }];
  t.deepEqual(actual, expected);
  t.end();
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
    type: 'block',
    children: [{
      type: 'block',
      children: [{
        type: 'embed',
        embedType: 'instagram',
        text: '',
        id: 'fdx1CSuEPV',
        url: 'http://instagram.com/p/fdx1CSuEPV/embed',
        caption: []
      }]
    }]
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() instagram - without caption', t => {
  const input = `<blockquote class="instagram-media" data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50.0% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/-7PIhyA6J3/" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A photo posted by David Björklund (@david_bjorklund)</a> on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2015-12-05T21:40:53+00:00">Dec 5, 2015 at 1:40pm PST</time></p></div></blockquote><script async defer src="//platform.instagram.com/en_US/embeds.js"></script>`;
  const actual = parse(input);
  const expected = [{
    type: 'embed',
    embedType: 'instagram',
    caption: [],
    id: '-7PIhyA6J3',
    url: 'https://www.instagram.com/p/-7PIhyA6J3/',
    text: null
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() instagram - bad input', t => {
  const input = `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></blockquote>`;
  const actual = parse(input);
  const expected = [{ children: [], type: 'blockquote' }];
  t.deepEqual(actual, expected);
  t.end();
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
      type: 'embed',
      embedType: 'facebook',
      embedAs: 'post'
    }
  ];
  t.deepEqual(actual, expected);
  t.end();
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
      type: 'embed',
      embedType: 'facebook',
      embedAs: 'video'
    }
  ];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() vine', t => {
  const input = '<iframe src="https://vine.co/v/bjHh0zHdgZT/embed/simple" width="600" height="600" frameborder="0"></iframe><script src="https://platform.vine.co/static/scripts/embed.js"></script>';
  const actual = parse(input);
  const expected = [{
    id: 'bjHh0zHdgZT',
    caption: [],
    type: 'embed',
    embedType: 'vine',
    url: 'https://vine.co/v/bjHh0zHdgZT/embed/simple'
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() vine embedly', t => {
  const input = '<iframe class="embedly-embed" src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fvine.co%2Fv%2FbjHh0zHdgZT%2Fembed%2Fsimple&amp;url=https%3A%2F%2Fvine.co%2Fv%2FbjHh0zHdgZT%2Fembed%2Fsimple&amp;image=https%3A%2F%2Fv.cdn.vine.co%2Fr%2Fthumbs%2F8B474922-0D0E-49AD-B237-6ED46CE85E8A-118-000000FFCD48A9C5_1.0.6.mp4.jpg%3FversionId%3D5mzXl2DXYBvKvF9rhcp.nvEJC.1N86RG&amp;key=25bf3602073943478e54668402a4f5a8&amp;type=text%2Fhtml&amp;schema=vine" width="600" height="600" scrolling="no" frameborder="0" allowfullscreen=""></iframe>';
  const actual = parse(input);
  const expected = [{
    id: 'bjHh0zHdgZT',
    caption: [],
    type: 'embed',
    embedType: 'vine',
    url: 'https://vine.co/v/bjHh0zHdgZT/embed/simple'
  }];
  t.deepEqual(actual, expected);
  t.end();
});

test('parse() iframe no src', t => {
  const input = '<iframe class="embedly-embed" width="600" height="600" scrolling="no" frameborder="0" allowfullscreen=""></iframe>';
  const actual = parse(input);
  const expected = [];
  t.deepEqual(actual, expected);
  t.end();
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
    caption: []
  }];
  t.deepEqual(actual, expected);
  t.end();
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
    caption: []
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
