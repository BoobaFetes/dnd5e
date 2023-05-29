import { HeroRepository } from '@boobafetes/dnd5e-api';
import {
  CombatEngine,
  CombatTarget,
  DamageObserver,
} from '@boobafetes/dnd5e-domain';
import { Button, Grid, Typography } from '@mui/material';
import { FC, memo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HeroImage } from '../../Hero/HeroImage';

const defaultHeroRepository = new HeroRepository();
interface IDuelProps {
  heroRepository?: HeroRepository;
}
export const Duel: FC<IDuelProps> = memo(
  ({ heroRepository = defaultHeroRepository }) => {
    const params = useParams<{ one: string; two: string }>();
    const ref = useRef({ engine: new CombatEngine() });

    const [one, setOne] = useState<CombatTarget>(null);
    const [two, setTwo] = useState<CombatTarget>(null);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
      const damageObserver: DamageObserver = {
        attackResult(
          hero,
          target,
          success,
          attackType,
          damage,
          isCriticalHit,
          isCriticalMiss
        ) {
          const msg = success
            ? [
                `${hero.character.name}: hit ${target.character.name}`,
                `    ${target.character.name} take ${damage} ${
                  isCriticalHit ? 'critical ' : ''
                }damage(s) [${attackType}]`,
              ]
            : [
                `${hero.character.name}: miss ${
                  isCriticalMiss ? 'really ' : ''
                }${target.character.name}`,
              ];

          setMessages((prev) => [...msg, ...prev]);
        },
        characterDied(hero, killer) {
          setMessages((prev) => [
            `${killer.character.name} has killed ${hero.character.name}`,
            ...prev,
          ]);
          hero.detachAllAttackObservers();
        },
      };

      const _one = CombatTarget.convertFromCharacter(
        heroRepository.get(params.one)
      );
      const _oneDetachAttackObserver =
        _one.attachAttackObserver(damageObserver);

      const _two = CombatTarget.convertFromCharacter(
        heroRepository.get(params.two)
      );
      const _twoDetachAttackObserver =
        _two.attachAttackObserver(damageObserver);

      ref.current.engine.addTargets([_one, _two]);
      ref.current.engine.setOrder();

      setOne(_one);
      setTwo(_two);

      return () => {
        _oneDetachAttackObserver();
        _twoDetachAttackObserver();
        ref.current.engine.clearTargets();
      };
    }, [params, heroRepository]);

    return !one || !two ? null : (
      <Grid container wrap="nowrap">
        <Grid item container xs={5} direction="column">
          <HeroImage src={one.character.image} />
          <Typography>{one.character.name}</Typography>
        </Grid>
        <Grid item container xs={2}>
          <Button onClick={() => console.log('btn attack pressed')}>
            Attack
          </Button>
        </Grid>
        <Grid item container xs={5} direction="column">
          <HeroImage src={two.character.image} />
          <Typography>{two.character.name}</Typography>
        </Grid>
        <Grid item xs={12} container direction="column">
          {messages.map((msg) => (
            <div>{msg}</div>
          ))}
        </Grid>
      </Grid>
    );
  }
);
