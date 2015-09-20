'use strict';

var update = require('../');

var elm = document.body.appendChild(document.createElement('div'));
elm.contentEditable = true;
elm.innerHTML = 'beepboop';

var key = require('keymaster');
key('backspace, delete, enter, ⌘+b, ctrl+b, ⌘+i, ctrl+i', function () {
  process.nextTick(function () {
    update(elm);
  });
});

update(elm);

elm.onpaste = function () {
  process.nextTick(function () {
    update(elm);
  });
};

window.update = function () {
  update(elm);
};
window.elm = elm;
