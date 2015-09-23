'use strict';

var renderInline = require('./inline-elements');
var rich = require('./rich');
var tags = {
  paragraph: 'P',
  header1: 'H1',
  header2: 'H2',
  header3: 'H3',
  header4: 'H4',
  header5: 'H5',
  header6: 'H6'
};
var VNode = require('virtual-dom').VNode;

module.exports = function (data, parent) {
  return data.map(function (obj) {
    if (obj.type === 'rich') {
      return rich(obj);
    }
    return tags[obj.type] && new VNode(tags[obj.type], {}, renderInline(obj.children));
  });
};
