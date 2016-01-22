const image = require('./image');
const video = require('./video');
const extend = require('xtend/mutable');

module.exports = function (opts) {
  const basicTypes = {
    image: image(),
    video: video()
  };
  const embedTypes = [];
  const customEmbedTypes = opts.customEmbedTypes || [];
  customEmbedTypes.forEach(function (type) {
    if (basicTypes[type.embedType]) {
      extend(basicTypes[type.embedType], type);
    } else {
      embedTypes.push(type);
    }
  });

  embedTypes.push(basicTypes.image);
  embedTypes.push(basicTypes.video);

  return embedTypes;
};
