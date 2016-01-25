import image from './image';
import video from './video';
import youtube from './youtube';
import objectAssign from 'object-assign';

export default opts => {
  const basicTypes = {
    image: image(),
    video: video(),
    youtube: youtube()
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

  embedTypes.push(basicTypes.image);
  embedTypes.push(basicTypes.video);
  embedTypes.push(basicTypes.youtube);

  return embedTypes;
};
