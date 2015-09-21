'use strict';

var renderInline = require('./inline-elements');
var tags = {
  paragraph: 'p',
  header1: 'h1',
  header2: 'h2',
  header3: 'h3',
  header4: 'h4',
  header5: 'h5',
  header6: 'h6'
};
var h = require('virtual-dom/h');

module.exports = function (data, parent) {
  return data.map(function (obj) {
    return tags[obj.type] && h(tags[obj.type], renderInline(obj.children));
  });
};
