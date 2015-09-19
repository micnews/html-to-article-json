'use strict';

var update = require('../');

var wrapper = document.body.appendChild(document.createElement('div'));
wrapper.className = 'wrapper';
var elm = wrapper.appendChild(document.createElement('div'));
elm.contentEditable = true;
elm.innerHTML = 'beepboop';

var key = require('keymaster');
key('backspace, delete, enter, ⌘+b, ctrl+b, ⌘+i, ctrl+i', function () {
  process.nextTick(function () {
    update(wrapper);
  });
});

update(wrapper);

wrapper.onpaste = function () {
  process.nextTick(function () {
    update(wrapper);
  });
};

window.update = function () {
  update(wrapper);
};
window.elm = elm;
