const image = require('./image');
const video = require('./video');
const extend = require('xtend/mutable');

module.exports = function (opts) {
  const basicTypes = {
    image: image(),
    video: video()
  };
  const richTypes = [];
  const customRichTypes = opts.customRichTypes || [];
  customRichTypes.forEach(function (type) {
    if (basicTypes[type.category]) {
      extend(basicTypes[type.category], type);
    } else {
      richTypes.push(type);
    }
  });

  richTypes.push(basicTypes.image);
  richTypes.push(basicTypes.video);

  return richTypes;
};
