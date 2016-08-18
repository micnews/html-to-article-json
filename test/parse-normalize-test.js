import test from './tape-wrapper';
import setup from '../lib';
import parse from 'query-dom';
import {join} from 'path';
import {readFileSync} from 'fs';

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
  readFileSync(join(__dirname, '/parse-normalize-fixtures/basic.html'), 'utf8'),
  require('./parse-normalize-fixtures/basic.json')
);
createTest(
  'inline-css',
  readFileSync(join(__dirname, '/parse-normalize-fixtures/inline-css.html'), 'utf8'),
  require('./parse-normalize-fixtures/inline-css.json')
);
createTest(
  'blocks',
  readFileSync(join(__dirname, '/parse-normalize-fixtures/blocks.html'), 'utf8'),
  require('./parse-normalize-fixtures/blocks.json')
);
createTest(
  'whitespace',
  readFileSync(join(__dirname, '/parse-normalize-fixtures/whitespace.html'), 'utf8'),
  require('./parse-normalize-fixtures/whitespace.json')
);
createTest(
  'linebreak',
  readFileSync(join(__dirname, '/parse-normalize-fixtures/linebreak.html'), 'utf8'),
  require('./parse-normalize-fixtures/linebreak.json')
);
createTest(
  'head-elements',
  readFileSync(join(__dirname, '/parse-normalize-fixtures/head-elements.html'), 'utf8'),
  require('./parse-normalize-fixtures/head-elements.json')
);
createTest(
  'blockquote',
  readFileSync(join(__dirname, '/parse-normalize-fixtures/blockquote.html'), 'utf8'),
  require('./parse-normalize-fixtures/blockquote.json')
);
createTest(
  'embeds',
  readFileSync(join(__dirname, '/parse-normalize-fixtures/embeds.html'), 'utf8'),
  require('./parse-normalize-fixtures/embeds.json')
);
createTest(
  'mark',
  readFileSync(join(__dirname, '/parse-normalize-fixtures/mark.html'), 'utf8'),
  require('./parse-normalize-fixtures/mark.json')
);

test('parseAndNormalize(elm)) whitespace', t => {
  t.same(parseAndNormalize('<p>\tbeep\tboop\t</p>'), [{
    type: 'paragraph',
    children: [{
      type: 'text',
      mark: false,
      markClass: null,
      content: ' beep boop ',
      href: null,
      bold: false,
      italic: false,
      strikethrough: false
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
          mark: false,
          markClass: null,
          content: 'flip flop',
          href: null,
          italic: false,
          bold: false,
          strikethrough: false
        }
      ]
    }];

    t.same(actual1, expected);
    t.same(actual2, expected);
  });
}
