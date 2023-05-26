import { ICharacterAbilities } from '@boobafetes/dnd5e-domain';
import {
  AddCircleOutlineOutlined,
  RemoveCircleOutlineOutlined,
} from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import { FC, memo } from 'react';
import { HeroAbility } from './HeroAbility';

interface IHeroAbilitiesProps
  extends Partial<Pick<IAbilityButtonsProps, 'action'>> {
  abilities: ICharacterAbilities;
}
export const HeroAbilities: FC<IHeroAbilitiesProps> = memo(
  ({ abilities, action }) => {
    return (
      <Grid item container>
        <HeroAbility sx={{ paddingTop: 2 }} {...abilities['str']}>
          {action && <AbilityButtons action={action} abilityIndex={'str'} />}
        </HeroAbility>
        <HeroAbility {...abilities['dex']}>
          {action && <AbilityButtons action={action} abilityIndex={'dex'} />}
        </HeroAbility>
        <HeroAbility {...abilities['con']}>
          {action && <AbilityButtons action={action} abilityIndex={'con'} />}
        </HeroAbility>
        <HeroAbility {...abilities['wis']}>
          {action && <AbilityButtons action={action} abilityIndex={'wis'} />}
        </HeroAbility>
        <HeroAbility {...abilities['int']}>
          {action && <AbilityButtons action={action} abilityIndex={'int'} />}
        </HeroAbility>
        <HeroAbility {...abilities['cha']}>
          {action && <AbilityButtons action={action} abilityIndex={'cha'} />}
        </HeroAbility>
      </Grid>
    );
  }
);

interface IAbilityButtonsProps {
  abilityIndex: string;
  action(abilityIndex: string): {
    minus(): void;
    plus(): void;
  };
}
const AbilityButtons: FC<IAbilityButtonsProps> = ({ action, abilityIndex }) => {
  return (
    <>
      <Button sx={{ flexGrow: 0 }} onClick={action(abilityIndex).minus}>
        <RemoveCircleOutlineOutlined />
      </Button>
      <Button sx={{ flexGrow: 0 }} onClick={action(abilityIndex).plus}>
        <AddCircleOutlineOutlined />
      </Button>
    </>
  );
};
