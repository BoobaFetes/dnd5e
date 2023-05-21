import {
  useQueryAbilityScores,
  useQueryClasses,
  useQueryRaces,
} from '@boobafetes/dnd5e-api';
import { HeroCreator as HeroCreatorView } from '@boobafetes/dnd5e-application';
import { IHero, makeHero } from '@boobafetes/dnd5e-domain';
import { FC, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DI } from '../DI';

interface IHeroCreatorPropsBase {
  hero: IHero;
  onSave(hero: IHero);
}

export const HeroCreate: FC = memo(() => {
  const navigate = useNavigate();
  return (
    <HeroCreator
      hero={makeHero()}
      onSave={(hero) => {
        if (DI.hero.add(hero)) {
          navigate(`/hero`);
        }
      }}
    />
  );
});
export const HeroEdit: FC = memo(() => {
  const { id } = useParams<{ id: string }>();
  return <HeroCreator hero={DI.hero.get(id)} onSave={DI.hero.update} />;
});

const HeroCreator: FC<IHeroCreatorPropsBase> = memo(({ hero, onSave }) => {
  const { data: { abilityScores } = { abilityScores: [] } } =
    useQueryAbilityScores();

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
      hero={hero}
      onSave={onSave}
      loading={racesLoading || classesLoading}
      error={(racesError || classesError)?.message}
    />
  );
});
