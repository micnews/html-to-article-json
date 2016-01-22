module.exports = function (elm) {
  if (elm.nodeName === 'SPAN') {
    if (elm.className === 'selection-marker-start') {
      return { type: 'selection-marker', start: true };
    }

    if (elm.className === 'selection-marker-end') {
      return { type: 'selection-marker', end: true };
    }
  }
};
