'use strict';

var jsdom = require('jsdom');
var extendInline = require('xtend/mutable');

var document = jsdom.jsdom(undefined, {
  virtualConsole: jsdom.createVirtualConsole().sendTo(console)
});
document.createRange = function () {
  return {
    setStartBefore: function () {},
    setEndAfter: function () {},
    setStart: function () {},
    setEnd: function () {}
  };
};
var window = document.defaultView;
extendInline(global, window);
