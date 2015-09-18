'use strict';

module.exports = function (elm) {
  var start = elm.querySelector('.selection-marker-start');
  var end = elm.querySelector('.selection-marker-end');
  var range = document.createRange();

  if (start) {
    range.setStartAfter(start);
    start.remove();
  }

  if (end) {
    range.setEndBefore(end);
    end.remove();
  }

  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
};
