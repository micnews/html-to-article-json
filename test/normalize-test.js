import setupNormalize from '../lib/normalize';
import test from './tape-wrapper';

const normalize = setupNormalize({});

test('normalize() minimum content', t => {
  const expected = [{
    type: 'paragraph',
    children: [{
      type: 'linebreak'
    }]
  }];

  t.same(normalize([]), expected);
  t.same(normalize([{ type: 'paragraph', children: [] }]), expected);
  t.same(normalize(normalize([])), expected);
});

test('normalize() minimum content in blockquote', t => {
  const expected = [{
    type: 'blockquote',
    pullQuote: false,
    children: [{
      type: 'paragraph',
      children: [{
        type: 'linebreak'
      }]
    }]
  }];
  t.same(normalize([{
    type: 'blockquote',
    children: []
  }]), expected);
  t.same(normalize([{
    type: 'blockquote',
    children: [{
      type: 'paragraph',
      children: []
    }]
  }]), expected);
});

test('normalize() remove not needed linebreaks', t => {
  const tree = [{
    type: 'paragraph',
    children: [
      { type: 'text', content: 'beep boop' },
      { type: 'linebreak' }
    ]
  }];
  const expected = [{
    type: 'paragraph',
    children: [
      { type: 'text', content: 'beep boop' }
    ]
  }];

  t.same(normalize(tree), expected);
});

test('normalize() keep needed linebreaks', t => {
  const tree = [{
    type: 'paragraph',
    children: [
      { type: 'linebreak' },
      { type: 'linebreak' }
    ]
  }];
  const tree2 = [{
    type: 'paragraph',
    children: [
      { type: 'text', content: 'beep boop' },
      { type: 'linebreak' },
      { type: 'linebreak' }
    ]
  }];
  const tree3 = [{
    type: 'paragraph',
    children: [
      { type: 'text', content: 'beep' },
      { type: 'linebreak' },
      { type: 'text', content: 'boop' }
    ]
  }];

  t.same(normalize(tree), tree);
  t.same(normalize(tree2), tree2);
  t.same(normalize(tree3), tree3);
});

test('normalize() add br-tag to empty text-container', t => {
  const tree = [{
    type: 'paragraph',
    children: []
  }, {
    type: 'paragraph',
    children: [
      { type: 'linebreak' }
    ]
  }];
  const expected = [{
    type: 'paragraph',
    children: [
      { type: 'linebreak' }
    ]
  }, {
    type: 'paragraph',
    children: [
      { type: 'linebreak' }
    ]
  }];

  t.same(normalize(tree), expected);
});

test('normalize() keep all empty mark-tags', t => {
  const tree = [{
    type: 'paragraph',
    children: [
      { type: 'text', mark: true, markClass: 'mark1', content: null },
      { type: 'text', mark: true, markClass: 'mark2', content: null }
    ]
  }];

  const expected = [{
    type: 'paragraph',
    children: [
      { type: 'linebreak' },
      { type: 'text', mark: true, markClass: 'mark1', content: null },
      { type: 'text', mark: true, markClass: 'mark2', content: null }
    ]
  }];

  t.same(normalize(tree), expected);
});

test('normalize() dont add minimum content linebreak for mark tag with content', t => {
  const tree = [{
    type: 'paragraph',
    children: [
      { type: 'text', mark: true, markClass: 'mark1', content: 'beep boop' }
    ]
  }];

  const expected = [{
    type: 'paragraph',
    children: [
      { type: 'text', mark: true, markClass: 'mark1', content: 'beep boop' }
    ]
  }];

  t.same(normalize(tree), expected);
});

test('normalize() don\'t remove br tags in-between mark with content', t => {
  const tree = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'foo bar'
    }, {
      type: 'linebreak'
    }, {
      type: 'text',
      mark: true,
      content: 'beep boop'
    }]
  }];
  const expected = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'foo bar'
    }, {
      type: 'linebreak'
    }, {
      type: 'text',
      mark: true,
      content: 'beep boop'
    }]
  }];
  const actual = normalize(tree);

  t.same(actual, expected);
});

test('normalize() content = null in block child', t => {
  const tree = [{
    type: 'block',
    children: [{
      type: 'text',
      content: null
    }]
  }];
  t.doesNotThrow(() => normalize(tree));
});
