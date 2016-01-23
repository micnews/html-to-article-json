import image from './image';
import video from './video';
import extend from 'xtend/mutable';

export default opts => {
  const basicTypes = {
    image: image(),
    video: video()
  };
  const embedTypes = [];
  const customEmbedTypes = opts.customEmbedTypes || [];
  customEmbedTypes.forEach(type => {
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
