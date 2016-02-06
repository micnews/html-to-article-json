import test from './tape-wrapper';
import setup from '../lib';
import parse from 'query-dom';

const fs = require('fs');

const _parseAndNormalize = setup();
const parseAndNormalize = process.browser
  ? (html) => {
    const node = document.createElement('div');
    node.innerHTML = html;
    return _parseAndNormalize(node.childNodes);
  }
  : _parseAndNormalize;

const createTest = (testName, html, expected) => {
  test('parseAndNormalize(elm)) ' + testName, t => {
    const actual = parseAndNormalize(html.trim());
    t.same(actual, expected);
  });
};

createTest(
  'basic',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/basic.html', 'utf8'),
  require('./parse-normalize-fixtures/basic.json')
);
createTest(
  'inline-css',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/inline-css.html', 'utf8'),
  require('./parse-normalize-fixtures/inline-css.json')
);
createTest(
  'blocks',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/blocks.html', 'utf8'),
  require('./parse-normalize-fixtures/blocks.json')
);
createTest(
  'whitespace',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/whitespace.html', 'utf8'),
  require('./parse-normalize-fixtures/whitespace.json')
);
createTest(
  'linebreak',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/linebreak.html', 'utf8'),
  require('./parse-normalize-fixtures/linebreak.json')
);
createTest(
  'head-elements',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/head-elements.html', 'utf8'),
  require('./parse-normalize-fixtures/head-elements.json')
);
createTest(
  'blockquote',
  fs.readFileSync(__dirname + '/parse-normalize-fixtures/blockquote.html', 'utf8'),
  require('./parse-normalize-fixtures/blockquote.json')
);

test('parseAndNormalize(elm)) whitespace', t => {
  t.same(parseAndNormalize('<p>\tbeep\tboop\t</p>'), [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: ' beep boop ',
      href: null,
      bold: false,
      italic: false
    }]
  }]);
});

if (!process.browser) {
  test('parseAndNormalize() different input', t => {
    const elms = parse('<p>flip flop</p>');
    const actual1 = parseAndNormalize(elms);
    const actual2 = parseAndNormalize(elms[0]);
    const expected = [{
      type: 'paragraph',
      children: [
        {
          type: 'text',
          content: 'flip flop',
          href: null,
          italic: false,
          bold: false
        }
      ]
    }];

    t.same(actual1, expected);
    t.same(actual2, expected);
  });
}
