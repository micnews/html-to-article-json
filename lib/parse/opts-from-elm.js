'use strict';

var generateFunction = require('generate-function');

var renderTextOpts = require('../text').reduce(function (opts, row) {
  opts[row.property] = row.is;
  return opts;
}, {});

var createObject = generateFunction();

createObject = createObject('function (opts, elm, renderTextOpts) {')('return {');

Object.keys(renderTextOpts).forEach(function (key) {
  createObject = createObject(
    '  %s: opts[\'%s\'] || renderTextOpts[\'%s\'](elm),',
    key, key, key);
});

createObject = createObject('};')('}');

var f = createObject.toFunction();
module.exports = function (opts, elm) {
  return f(opts, elm, renderTextOpts);
};
