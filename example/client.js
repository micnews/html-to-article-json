'use strict';

var parse = require('../lib/index')({});

var input = document.querySelector('.input');
var result = document.querySelector('.result');

function update () {
  var articleJson = parse(input.outerHTML);
  result.innerHTML = JSON.stringify(articleJson, null, 2);
}

var key = require('keymaster');
key('backspace, delete, enter, ⌘+b, ctrl+b, ⌘+i, ctrl+i', function () {
  process.nextTick(function () {
    update();
  });
});

update();

input.onpaste = function () {
  process.nextTick(function () {
    update();
  });
};

window.update = update;
