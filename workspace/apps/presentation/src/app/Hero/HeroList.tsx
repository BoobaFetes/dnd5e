import { HeroRepository } from '@boobafetes/dnd5e-api';
import { HeroList as HeroListView } from '@boobafetes/dnd5e-application';
import { IHero } from '@boobafetes/dnd5e-domain';
import { FC, memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DI } from '../DI';

interface IHeroListProps {
  heroRepository?: HeroRepository;
}
export const HeroList: FC<IHeroListProps> = memo(
  ({ heroRepository = DI.hero }) => {
    const navigate = useNavigate();
    const [heroes, setHeroes] = useState<IHero[]>(heroRepository.all());

    useEffect(() => {
      return heroRepository.subscribe((list) => {
        setHeroes([...list]);
      });
    }, [heroRepository, setHeroes]);

    return (
      <HeroListView
        heroes={heroes}
        onAdd={() => navigate('/hero/edit')}
        onEdit={(hero) => navigate(`/hero/edit/${hero.id}`)}
        onSelect={(hero) => heroRepository.select(hero.id)}
        onDelete={(hero) => heroRepository.remove(hero.id)}
      />
    );
  }
);
