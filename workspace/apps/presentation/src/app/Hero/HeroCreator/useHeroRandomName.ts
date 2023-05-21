export const useHeroRandomName = () => {
  return {
    roll() {
      const index = Math.floor(Math.random() * names.length);
      return names[index];
    },
  };
};

const names = [
  'Elysia Seraphine',
  'Thalon Darkmore',
  'Lyra Silverwind',
  'Zephyr Stormrider',
  'Alistair Frostbane',
  'Isabella Nightshade',
  'Orion Emberheart',
  'Selene Moonshadow',
  'Darius Blackthorn',
  'Freya Ironspell',
  'Magnus Stormstrider',
  'Aurora Skyfire',
  'Cedric Shadowdancer',
  'Valeria Frostfang',
  'Lysander Thornbrook',
  'Seraphina Ravensong',
  'Lucius Bloodmoon',
  'Genevieve Starling',
  'Roderick Stormforge',
  'Elara Fireheart',
];
