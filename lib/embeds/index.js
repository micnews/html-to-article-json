import image from './image';
import video from './video';
import youtube from './youtube';
import objectAssign from 'object-assign';
import twitter from './twitter';
import values from 'lodash.values';
import instagram from './instagram';
import facebook from './facebook';

export default opts => {
  const basicTypes = {
    image: image(),
    video: video(),
    youtube: youtube(),
    twitter: twitter(),
    instagram: instagram(),
    facebook: facebook()
  };
  const embedTypes = [];
  const customEmbedTypes = opts.customEmbedTypes || [];
  customEmbedTypes.forEach(type => {
    if (basicTypes[type.embedType]) {
      objectAssign(basicTypes[type.embedType], type);
    } else {
      embedTypes.push(type);
    }
  });

  return embedTypes.concat(values(basicTypes));
};
