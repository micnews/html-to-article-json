const test = require('tape');
const renderString = require('../src/index').renderString;

test('renderString() basic', function (t) {
  const input = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beepboop'
    }]
  }];
  t.equal(renderString(input), '<div><p>beepboop</p></div>');
  t.end();
});
