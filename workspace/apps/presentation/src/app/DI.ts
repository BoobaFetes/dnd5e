import { HeroRepository } from '@boobafetes/dnd5e-api';

export const DI = { hero: new HeroRepository(window.localStorage) };
