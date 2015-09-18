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
    var range = window.getSelection().getRangeAt(0);
    console.log(range.startContainer, range.startOffset);
    update(wrapper);
    range = window.getSelection().getRangeAt(0);
    console.log(range.startContainer, range.startOffset);
  });
};

window.update = function () {
  update(elm);
};
window.elm = elm;
