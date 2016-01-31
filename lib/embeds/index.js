import image from './types/image';
import video from './types/video';
import youtube from './types/youtube';
import twitter from './types/twitter';
import values from 'lodash.values';
import instagram from './types/instagram';
import facebook from './types/facebook';
import vine from './types/vine';
import custom from './types/custom';

export default opts => {
  const basicTypes = {
    image, video, youtube, twitter, instagram, facebook, vine,
    custom /* last element */
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
