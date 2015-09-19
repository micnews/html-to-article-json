'use strict';

if (!process.browser) {
  var jsdom = require('jsdom');
  var extendInline = require('xtend/mutable');

  var _document = jsdom.jsdom(undefined, {
    virtualConsole: jsdom.createVirtualConsole().sendTo(console)
  });
  var _window = _document.defaultView;
  extendInline(global, _window);
}
