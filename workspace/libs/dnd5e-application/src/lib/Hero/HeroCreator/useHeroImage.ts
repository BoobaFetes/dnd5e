import { useCallback, useMemo, useState } from 'react';
import { HERO_IMAGES } from '../variables';

type CurrentImageType = {
  label: string;
  src: string;
};

interface UseHeroChangeArgs {
  onChange(img: CurrentImageType): void;
}

export const useHeroImage = ({ onChange }: UseHeroChangeArgs) => {
  const [index, setIndex] = useState(0);

  const getCurrentImage = useCallback((current: number) => {
    const src = HERO_IMAGES[current];
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
        onChange(getCurrentImage(_index));
      },
      currentImage: getCurrentImage(index),
      nextImage() {
        let _index = index + 1;
        if (index >= HERO_IMAGES.length - 1) {
          _index = 0;
        }
        setIndex(_index);
        onChange(getCurrentImage(_index));
      },
    }),
    [getCurrentImage, index, onChange]
  );
};
