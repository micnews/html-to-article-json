'use strict';

var update = require('../');

var wrapper = document.body.appendChild(document.createElement('div'));
wrapper.className = 'wrapper';
var elm = wrapper.appendChild(document.createElement('div'));
elm.contentEditable = true;
elm.innerHTML = 'beepboop';

update(wrapper);
wrapper.onkeypress = function () {
  process.nextTick(function () {
    update(wrapper);
  });
};
wrapper.onpaste = function () {
  process.nextTick(function () {
    update(wrapper);
  });
};

window.update = function () {
  update(wrapper);
};
window.elm = elm;
