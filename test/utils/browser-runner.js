#!/usr/bin/env node
'use strict';

var jsdom = require('jsdom');
var extendInline = require('xtend/mutable');

var _document = jsdom.jsdom(undefined, {
  virtualConsole: jsdom.createVirtualConsole().sendTo(console)
});
var _window = _document.defaultView;
extendInline(global, _window);

require('babel-tape-runner/bin/babel-tape-runner');
