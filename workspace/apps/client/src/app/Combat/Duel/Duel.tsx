import { HeroRepository, HeroRepositoryClass } from '@boobafetes/dnd5e-api';
import {
  CombatEngine,
  CombatTarget,
  DamageObserver,
} from '@boobafetes/dnd5e-domain';
import { Box, Grid } from '@mui/material';
import { FC, memo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Attacker } from '../Attacker';

interface IDuelProps {
  heroRepository?: HeroRepositoryClass;
}
export const Duel: FC<IDuelProps> = memo(
  ({ heroRepository = HeroRepository }) => {
    const params = useParams<{ one: string; two: string }>();
    const ref = useRef([
      heroRepository.get(params.one),
      heroRepository.get(params.two),
    ]);
    const [attackerIndex, setAttackerIndex] = useState<number>(null);
    const [engine] = useState(new CombatEngine());
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
      const damageObserver: DamageObserver = {
        attackResult(
          hero,
          target,
          {
            attackResult,
            attackModifiers,
            attackRoll,
            attackType,
            damage,
            isCriticalHit,
            isCriticalMiss,
            useFinesse,
            useTwoHands,
            weapons,
          }
        ) {
          const msg = attackResult
            ? [
                '',
                `${hero.character.name}: hit ${target.character.name} with ${
                  useTwoHands ? '1 hand' : '2 hands'
                }`,
                `${hero.character.name}: give ${damage} ${
                  isCriticalHit ? 'critical ' : ''
                } damage(s) of type ${attackType.toLocaleLowerCase()} to ${
                  target.character.name
                }`,
                `${
                  hero.character.name
                }: stats : roll: ${attackRoll} / modifier:${attackModifiers} / finesse:${useFinesse} / weapons:${weapons.join(
                  ', '
                )}`,
              ]
            : [
                '',
                `${hero.character.name}: miss ${
                  isCriticalMiss ? 'really ' : ''
                }${target.character.name}`,
              ];

          setMessages((prev) => [...msg, ...prev]);
        },
        characterDied(hero, killer) {
          setMessages((prev) => [
            `${killer.character.name} has killed ${hero.character.name}`,
            `${killer.character.name} has win the combat !!!`,
            ...prev,
          ]);
          hero.detachAllAttackObservers();
        },
      };

      const attackObservers: Array<() => void> = [];
      const targets: CombatTarget[] = [];
      ref.current.forEach((character) => {
        const current = CombatTarget.convertFromCharacter(character);
        targets.push(current);
        attackObservers.push(current.attachAttackObserver(damageObserver));
      });

      engine.addTargets(targets);
      engine.setOrder();
      setAttackerIndex(0);
      return () => {
        attackObservers.forEach((obs) => obs());
        engine.clearTargets();
      };
    }, [params, heroRepository, engine]);

    return attackerIndex === null ? null : (
      <Grid container direction="column" wrap="nowrap">
        <Grid item container spacing={4}>
          <Grid item xs={6}>
            <Attacker
              engine={engine}
              index={0}
              characters={ref.current}
              targetIndex={1}
              canDoAction={attackerIndex === 0}
              hasAttacked={() => {
                setAttackerIndex(1);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Attacker
              engine={engine}
              index={1}
              characters={ref.current}
              targetIndex={0}
              canDoAction={attackerIndex === 1}
              hasAttacked={() => {
                setAttackerIndex(0);
              }}
            />
          </Grid>
        </Grid>
        <Grid item container direction="column">
          {messages.map((msg, index) => (
            <Box key={index} sx={{ minHeight: 10 }}>
              {msg}
            </Box>
          ))}
        </Grid>
      </Grid>
    );
  }
);
