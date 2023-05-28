import { ICharacter } from '@boobafetes/dnd5e-domain';
import { FC, memo } from 'react';

export const DuelFromParams: FC = () => {
  return null; //<Duel />;
};

interface IDuelProps {
  heroTeam: ICharacter[];
  banditTeam: ICharacter[];
}
export const Duel: FC<IDuelProps> = memo(({ heroTeam, banditTeam }) => {
  //   const engine = useRef(new CombatEngine());
  //   useEffect(() => {
  //     heroTeam.foea(hero => CombatTarget.convertFromHero(hero))
  //     engine.current.addTargets;
  //   }, [heroTeam, banditTeam, engine.current]);

  return null;
});
