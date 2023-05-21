import { useMemo, useState } from 'react';

export const useHeroImage = () => {
  const [index, setIndex] = useState(0);

  const currentImage = useMemo(() => {
    const src = images[index];
    const file = src.substring('./assets/'.length);

    const category = file.substring(0, file.indexOf('/'));

    const imgIndex = file.substring(file.indexOf('/') + 1, file.indexOf('.'));

    return { label: `${category} - ${imgIndex}`, src };
  }, [index]);

  return {
    previousImage() {
      let _index = index - 1;
      if (_index < 0) {
        _index = images.length - 1;
      }
      setIndex(_index);
    },
    currentImage,
    nextImage() {
      let _index = index + 1;
      if (index >= images.length - 1) {
        _index = 0;
      }
      setIndex(_index);
    },
  };
};

const images = [
  './assets/ranger/0.jpg',
  './assets/ranger/1.jpg',
  './assets/ranger/2.jpg',
  './assets/ranger/3.jpg',
  './assets/ranger/4.jpg',
  './assets/ranger/5.jpg',
  './assets/ranger/6.jpg',
  './assets/ranger/7.jpg',

  './assets/warrior/0.jpg',
  './assets/warrior/1.jpg',
  './assets/warrior/2.jpg',
  './assets/warrior/3.jpg',
  './assets/warrior/4.jpg',
  './assets/warrior/5.jpg',
  './assets/warrior/6.jpg',
  './assets/warrior/7.jpg',
  './assets/warrior/8.jpg',

  './assets/wizard/0.jpg',
  './assets/wizard/1.jpg',
  './assets/wizard/2.jpg',
  './assets/wizard/3.jpg',
  './assets/wizard/4.jpg',
  './assets/wizard/5.jpg',
  './assets/wizard/6.jpg',
  './assets/wizard/7.jpg',
];
