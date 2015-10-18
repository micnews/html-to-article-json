const tags = {
  paragraph: 'P',
  header1: 'H1',
  header2: 'H2',
  header3: 'H3',
  header4: 'H4',
  header5: 'H5',
  header6: 'H6'
};
const VNode = require('virtual-dom').VNode;
const setupRenderInline = require('./inline-elements');
const setupRich = require('./rich');

module.exports = function (opts) {
  const renderInline = setupRenderInline(opts);
  const rich = setupRich(opts);

  return function (data) {
    return data.map(function (obj) {
      if (obj.type === 'rich') {
        return rich(obj);
      }
      return tags[obj.type] && new VNode(tags[obj.type], {}, renderInline(obj.children));
    });
  };
};
