import { ICharacterAbility } from '@boobafetes/dnd5e-domain';
import { Grid, GridTypeMap, Typography } from '@mui/material';
import { FC, PropsWithChildren, memo } from 'react';

export const HeroAbility: FC<
  PropsWithChildren<ICharacterAbility & GridTypeMap['props']>
> = memo(({ index, modifier, name, value, children, ...gridProps }) => {
  return (
    <Grid item container alignItems="center" {...gridProps}>
      <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
      <Typography
        sx={{ flexGrow: 0, width: 50, textAlign: 'end', marginRight: 1 }}
      >{`(${modifier > 0 ? '+' : ''}${modifier})`}</Typography>
      <Typography sx={{ flexGrow: 0, width: 50 }}>{value}</Typography>
      {children}
    </Grid>
  );
});
