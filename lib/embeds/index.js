import image from './image';
import video from './video';
import youtube from './youtube';
import twitter from './twitter';
import values from 'lodash.values';
import instagram from './instagram';
import facebook from './facebook';
import vine from './vine';

export default opts => {
  const basicTypes = {
    image, video, youtube, twitter, instagram, facebook, vine
  };
  const embedTypes = [];
  const customEmbedTypes = opts.customEmbedTypes || [];
  customEmbedTypes.forEach(type => {
    if (basicTypes[type.embedType]) {
      basicTypes[type.embedType] = type.parse;
    } else {
      embedTypes.push(type.parse);
    }
  });

  return embedTypes.concat(values(basicTypes));
};
