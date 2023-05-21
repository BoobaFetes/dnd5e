import { HERO_NAMES } from '../variables';

export const useHeroRandomName = () => {
  return {
    roll() {
      const index = Math.floor(Math.random() * HERO_NAMES.length);
      return HERO_NAMES[index];
    },
  };
};
