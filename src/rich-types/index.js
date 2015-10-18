var image = require('./image');
var video = require('./video');
var extend = require('xtend/mutable');

module.exports = function (opts) {
  var basicTypes = {
    image: image(),
    video: video()
  };
  var richTypes = [];
  var customRichTypes = opts.customRichTypes || [];
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
