const getTextFormattings = require('../text-formattings');

module.exports = function (opts) {
  const textFormattings = getTextFormattings(opts);

  return function renderText (obj, elm) {
    let child = obj.content;

    textFormattings.forEach(function (row) {
      if (obj[row.property]) {
        child = row.render(child, obj);
      }
    });

    return child;
  };
};
