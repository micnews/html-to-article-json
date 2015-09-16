'use strict';

var parseHtml = require('../lib/parse-html');
var render = require('../lib/render');
var patch = require('incremental-dom').patch;
var Immutable = require('immutable');

var wrapper = document.body.appendChild(document.createElement('div'));
wrapper.className = 'wrapper';
var elm = wrapper.appendChild(document.createElement('div'));
elm.contentEditable = true;
elm.innerHTML = 'beepboop';

patch(elm, function () {
  render(Immutable.fromJS(parseHtml(elm)));
});
elm.onkeypress = function () {
  process.nextTick(function () {
    parseHtml(elm);
  });
};

window.parse = function () {
  parseHtml(elm);
};
window.elm = elm;
