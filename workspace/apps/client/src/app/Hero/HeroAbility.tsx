import { ICharacterAbility } from '@boobafetes/dnd5e-domain';
import { Grid, GridTypeMap, Typography } from '@mui/material';
import { FC, PropsWithChildren, memo } from 'react';

export const HeroAbility: FC<
  PropsWithChildren<ICharacterAbility & GridTypeMap['props']>
> = memo(({ index, modifier, name, value, children, ...gridProps }) => {
  return (
    <Grid {...gridProps} item container alignItems="center" wrap="nowrap">
      <Grid item container sx={{ flexGrow: 1 }}>
        <Typography>{name}</Typography>
      </Grid>
      <Grid
        item
        container
        justifyContent="center"
        sx={{ flexGrow: 0, width: 100 }}
      >
        <Typography>{`(${
          modifier > 0 ? '+' : ''
        }${modifier}) ${value}`}</Typography>
      </Grid>
      <Grid
        item
        container
        justifyContent="flex-end"
        wrap="nowrap"
        sx={{ flexGrow: 0, width: 60 }}
      >
        {children}
      </Grid>
    </Grid>
  );
});
