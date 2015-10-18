module.exports = function (elm) {
  const start = elm.querySelector('.selection-marker-start');
  const end = elm.querySelector('.selection-marker-end');
  const range = document.createRange();

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
