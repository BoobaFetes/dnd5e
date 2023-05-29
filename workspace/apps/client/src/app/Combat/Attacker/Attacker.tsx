import {
  CombatEngine,
  ICharacter,
  WeaponRange,
} from '@boobafetes/dnd5e-domain';
import { Box, Button, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { HeroImage } from '../../Hero/HeroImage';
import LifeBar from './LifeBar';

interface IAttackerProps {
  engine: CombatEngine;
  index: number;
  targetIndex: number;
  characters: ICharacter[];
  canDoAction: boolean;
  hasAttacked(): void;
}
export const Attacker: FC<IAttackerProps> = memo(
  ({ engine, index, targetIndex, characters, canDoAction, hasAttacked }) => {
    const attacker = engine.targets[index];
    const target = engine.targets[targetIndex];
    const character = characters.find(
      (c) => c.index === attacker.character.index
    );
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            alignItems: 'center',
          }}
        >
          <HeroImage src={character.image} />
          <Typography sx={{ marginBottom: 2 }}>{character.name}</Typography>
        </Box>
        <LifeBar
          value={attacker.character.health}
          maxValue={character.health}
        />
        <Box
          sx={{
            display: 'flex',
            visibility:
              engine.targets.length > 1 &&
              attacker.character.health > 0 &&
              canDoAction
                ? 'unset'
                : 'hidden',
            alignItems: 'center',
            marginTop: 2,
            justifyContent: 'center',
          }}
        >
          <Typography>Attack</Typography>
          <Button
            onClick={() => {
              attacker.attack(target, WeaponRange.Melee);
              hasAttacked();
            }}
          >
            Melee
          </Button>
          <Button
            disabled={!attacker.character.equipement.ranged}
            onClick={() => {
              attacker.attack(target, WeaponRange.Ranged);
              hasAttacked();
            }}
          >
            Ranged
          </Button>
        </Box>
      </Box>
    );
  }
);
