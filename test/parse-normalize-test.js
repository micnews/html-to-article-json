import test from 'tape';
import setup from '../lib';
const fs = require('fs');

const parseAndNormalize = setup();

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

function createTest (testName, html, expected) {
  test('parseAndNormalize(elm)) ' + testName, function (t) {
    t.deepEqual(parseAndNormalize(html.trim()), expected);

    t.end();
  });
}

test('parseAndNormalize(elm)) whitespace \t', function (t) {
  t.deepEqual(parseAndNormalize('<p>\tbeep\tboop\t</p>'), [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: ' beep boop ',
      href: null,
      bold: false,
      italic: false
    }]
  }]);
  t.end();
});
