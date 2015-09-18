'use strict';

var jsdom = require('jsdom');
var extendInline = require('xtend/mutable');

var document = jsdom.jsdom(undefined, {
  virtualConsole: jsdom.createVirtualConsole().sendTo(console)
});
var window = document.defaultView;
extendInline(global, window);
