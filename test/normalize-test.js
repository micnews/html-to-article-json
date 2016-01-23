import setupNormalize from '../lib/normalize';
import test from 'tape';

const normalize = setupNormalize({});

test('normalize() minimum content', t => {
  const expected = [{
    type: 'paragraph',
    children: [{
      type: 'linebreak'
    }]
  }];

  t.deepEqual(normalize([]), expected);
  t.deepEqual(normalize([{ type: 'paragraph', children: [] }]), expected);
  t.deepEqual(normalize(normalize([])), expected);

  t.end();
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

  t.deepEqual(normalize(tree), expected);

  t.end();
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

  t.deepEqual(normalize(tree), tree);
  t.deepEqual(normalize(tree2), tree2);
  t.deepEqual(normalize(tree3), tree3);
  t.end();
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

  t.deepEqual(normalize(tree), expected);
  t.end();
});
