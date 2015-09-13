'use strict';

var parseHtml = require('../lib/parse-html');
var render = require('../lib/render');
var patch = require('incremental-dom').patch;
var Immutable = require('immutable');

var elm = document.body.appendChild(document.createElement('div'));
elm.contentEditable = true;
elm.innerHTML = '<div>WTF?</div>';

patch(elm, function () {
  render(Immutable.fromJS(parseHtml(elm)));
});

elm.onpaste = function () {
  process.nextTick(function () {
    patch(elm, function () {
      render(Immutable.fromJS(parseHtml(elm)));
    });
  });
};
