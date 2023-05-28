import { useCallback, useMemo, useState } from 'react';
import { HERO_IMAGES } from '../variables';

type CurrentImageType = {
  label: string;
  src: string;
};

export const useHeroImage = () => {
  const [index, setIndex] = useState(randomIndex());

  const getImageBySrc = useCallback((src: string) => {
    const file = src.substring('./assets/'.length);

    const category = file.substring(0, file.indexOf('/'));

    const imgIndex = file.substring(file.indexOf('/') + 1, file.indexOf('.'));

    return { label: `${category} - ${imgIndex}`, src };
  }, []);

  return useMemo(
    () => ({
      previousImage() {
        let _index = index - 1;
        if (_index < 0) {
          _index = HERO_IMAGES.length - 1;
        }
        setIndex(_index);
        return getImageBySrc(HERO_IMAGES[_index]);
      },
      currentImage: getImageBySrc(HERO_IMAGES[index]),
      nextImage() {
        let _index = index + 1;
        if (index >= HERO_IMAGES.length - 1) {
          _index = 0;
        }
        setIndex(_index);
        return getImageBySrc(HERO_IMAGES[_index]);
      },
    }),
    [getImageBySrc, index]
  );
};

function randomIndex() {
  return Math.floor(Math.random() * HERO_IMAGES.length);
}

export function getImageBySrc(src: string): CurrentImageType {
  if (!src) {
    return { label: undefined, src };
  }
  const file = src.substring('./assets/'.length);

  const category = file.substring(0, file.indexOf('/'));

  const imgIndex = file.substring(file.indexOf('/') + 1, file.indexOf('.'));

  return { label: `${category} - ${imgIndex}`, src };
}
