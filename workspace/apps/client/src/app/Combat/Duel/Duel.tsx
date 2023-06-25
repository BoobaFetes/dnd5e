import { HeroRepository, HeroRepositoryClass } from '@boobafetes/dnd5e-api';
import {
  CombatEngine,
  CombatTarget,
  DamageObserver,
} from '@boobafetes/dnd5e-domain';
import { Box, Grid } from '@mui/material';
import { FC, ReactNode, memo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Attacker } from '../Attacker';
import { generateUniqueColor } from './generateUniqueColor';

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
    const [messages, setMessages] = useState<ReactNode[]>([]);

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
          const colorHero = generateUniqueColor(hero.character.name);
          const colorTarget = generateUniqueColor(target.character.name);
          const msg = attackResult
            ? [
                <p>
                  <span
                    style={{ backgroundColor: colorHero, fontWeight: 'bold' }}
                  >
                    {hero.character.name}:
                  </span>
                  <br />
                  <ul>
                    <li>
                      hit{' '}
                      <span style={{ backgroundColor: colorTarget }}>
                        {target.character.name}
                      </span>{' '}
                      with {useTwoHands ? '2 hands' : '1 hand'}
                    </li>
                    <li>
                      give {damage} {isCriticalHit ? 'critical ' : ''} damage(s)
                      of type {attackType.toLocaleLowerCase()} to{' '}
                      <span style={{ backgroundColor: colorTarget }}>
                        {target.character.name}
                      </span>
                    </li>
                    <li>
                      stats :
                      <ul>
                        <li>roll: {attackRoll}</li>
                        <li>modifier:{attackModifiers}</li>
                        <li>finesse:{useFinesse}</li>
                        <li>weapons:{weapons.join(', ')}</li>
                      </ul>
                    </li>
                  </ul>
                </p>,
              ]
            : [
                <p>
                  <span
                    style={{ backgroundColor: colorHero, fontWeight: 'bold' }}
                  >
                    {hero.character.name}:
                  </span>
                  <br />
                  <div>
                    {isCriticalMiss ? 'critically ' : ' '}miss{' '}
                    <span style={{ backgroundColor: colorTarget }}>
                      {target.character.name}
                    </span>
                  </div>
                </p>,
              ];

          setMessages((prev) => [...msg, ...prev]);
        },
        characterDied(hero, killer) {
          const colorHero = generateUniqueColor(hero.character.name);
          const colorKiller = generateUniqueColor(killer.character.name);
          setMessages((prev) => [
            <p>
              <span
                style={{ backgroundColor: colorKiller, fontWeight: 'bold' }}
              >
                {killer.character.name}
              </span>{' '}
              win the duel !!!
              <br />
              <div>
                <span style={{ backgroundColor: colorKiller }}>
                  {killer.character.name}
                </span>{' '}
                has killed{' '}
                <span style={{ backgroundColor: colorHero }}>
                  {hero.character.name}
                </span>
              </div>
            </p>,
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
        setMessages([]);
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
