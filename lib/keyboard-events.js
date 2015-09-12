'use strict';

var dom = require('dom-events');
var addChar = require('./add-char');

module.exports = function (elm, getData, cb) {
  dom.on(elm, 'keypress', function (event) {
    var data = getData();
    cb(addChar(data, event.key));
  });
};
