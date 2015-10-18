module.exports = function (elm) {
  var start = elm.querySelector('.selection-marker-start');
  var end = elm.querySelector('.selection-marker-end');
  var range = document.createRange();

  if (!start || !end) {
    return;
  }

  range.setStartAfter(start);
  start.parentNode.removeChild(start);

  range.setEndBefore(end);
  end.parentNode.removeChild(end);

  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
};
