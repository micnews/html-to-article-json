'use strict';

var renderInline = require('./inline-elements');

var IncrementalDom = require('incremental-dom');
var elementOpen = IncrementalDom.elementOpen;
var elementClose = IncrementalDom.elementClose;

var methods = {
  paragraph: paragraph,
  header1: setupHeader('1'),
  header2: setupHeader('2'),
  header3: setupHeader('3'),
  header4: setupHeader('4'),
  header5: setupHeader('5'),
  header6: setupHeader('6')
};

module.exports = function (obj) {
  return methods[obj.type] && methods[obj.type](obj);
};

function setupHeader (level) {
  return function (obj) {
    elementOpen('h' + level);
    obj.children.forEach(renderInline);
    elementClose('h' + level);
  };
}

function paragraph (obj) {
  elementOpen('p');
  obj.children.forEach(renderInline);
  elementClose('p');
}
