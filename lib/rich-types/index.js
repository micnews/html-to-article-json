'use strict';

var defaultRichTypes = [
  require('./image'),
  require('./video')
];

module.exports = function (opts) {
  return defaultRichTypes;
};
