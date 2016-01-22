const normalize = require('../lib/normalize')({});
const test = require('tape');

test('normalize() minimum content', function (t) {
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

test('normalize() minimum content with selection markers', function (t) {
  const input = [{
    type: 'paragraph',
    children: [
      {
        type: 'selection-marker',
        start: true
      }, {
        type: 'selection-marker',
        end: true
      }
    ]
  }];
  const expected = [{
    type: 'paragraph',
    children: [
      {
        type: 'linebreak'
      }, {
        type: 'selection-marker',
        start: true
      }, {
        type: 'selection-marker',
        end: true
      }
    ]
  }];

  t.deepEqual(normalize(input), expected);

  t.end();
});

test('normalize() remove not needed linebreaks', function (t) {
  const tree = [{
    type: 'paragraph',
    children: [
      { type: 'text', content: 'beep boop' },
      { type: 'linebreak' }
    ]
  }];
  const tree2 = [{
    type: 'paragraph',
    children: [
      { type: 'text', content: 'beep boop' },
      { type: 'selection-marker', start: true },
      { type: 'selection-marker', end: true },
      { type: 'linebreak' }
    ]
  }];
  const expected = [{
    type: 'paragraph',
    children: [
      { type: 'text', content: 'beep boop' }
    ]
  }];
  const expected2 = [{
    type: 'paragraph',
    children: [
      { type: 'text', content: 'beep boop' },
      { type: 'selection-marker', start: true },
      { type: 'selection-marker', end: true }
    ]
  }];

  t.deepEqual(normalize(tree), expected);
  t.deepEqual(normalize(tree2), expected2);

  t.end();
});

test('normalize() keep needed linebreaks', function (t) {
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
      { type: 'selection-marker', start: true },
      { type: 'selection-marker', end: true },
      { type: 'linebreak' },
      { type: 'linebreak' }
    ]
  }];
  const tree3 = [{
    type: 'paragraph',
    children: [
      { type: 'text', content: 'beep boop' },
      { type: 'linebreak' },
      { type: 'linebreak' }
    ]
  }];
  const tree4 = [{
    type: 'paragraph',
    children: [
      { type: 'text', content: 'beep' },
      { type: 'linebreak' },
      { type: 'text', content: 'boop' }
    ]
  }];
  const tree5 = [{
    type: 'paragraph',
    children: [
      { type: 'selection-marker', start: true },
      { type: 'selection-marker', end: true },
      { type: 'linebreak' }
    ]
  }];
  const tree6 = [{
    type: 'paragraph',
    children: [
      { type: 'selection-marker', start: true },
      { type: 'linebreak' },
      { type: 'selection-marker', end: true }
    ]
  }];
  const tree7 = [{
    type: 'paragraph',
    children: [
      { type: 'linebreak' },
      { type: 'selection-marker', start: true },
      { type: 'selection-marker', end: true }
    ]
  }];

  t.deepEqual(normalize(tree), tree);
  t.deepEqual(normalize(tree2), tree2);
  t.deepEqual(normalize(tree3), tree3);
  t.deepEqual(normalize(tree4), tree4);
  t.deepEqual(normalize(tree5), tree5);
  t.deepEqual(normalize(tree6), tree6);
  t.deepEqual(normalize(tree7), tree7);
  t.end();
});

test('normalize() add br-tag to empty text-container', function (t) {
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
