import {
  useQueryAbilityScores,
  useQueryClasses,
  useQueryRaces,
} from '@boobafetes/dnd5e-api';
import { HeroCreator as HeroCreatorView } from '@boobafetes/dnd5e-application';
import { ICharacter } from '@boobafetes/dnd5e-domain';
import { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DI } from '../DI';

interface IHeroCreatorPropsBase {
  onSave(hero: ICharacter);
}

export const HeroCreate: FC = memo(() => {
  const navigate = useNavigate();
  return (
    <HeroCreator
      onSave={(hero) => {
        if (DI.hero.add(hero)) {
          navigate(`/hero`);
        }
      }}
    />
  );
});

const HeroCreator: FC<IHeroCreatorPropsBase> = memo(({ onSave }) => {
  const {
    data: { abilityScores } = { abilityScores: [] },
    loading: abilityScoresLoading,
    error: abilityScoresError,
  } = useQueryAbilityScores();

  const {
    data: { races } = { races: [] },
    loading: racesLoading,
    error: racesError,
  } = useQueryRaces();

  const {
    data: { classes } = { classes: [] },
    loading: classesLoading,
    error: classesError,
  } = useQueryClasses();

  return (
    <HeroCreatorView
      abilityScores={abilityScores}
      races={races}
      classes={classes}
      onSave={onSave}
      loading={abilityScoresLoading || racesLoading || classesLoading}
      error={(abilityScoresError || racesError || classesError)?.message}
    />
  );
});
