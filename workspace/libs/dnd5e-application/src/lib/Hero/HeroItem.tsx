import { ICharacter } from '@boobafetes/dnd5e-domain';
import { Box, Grid, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { HeroImage } from './HeroImage';

interface IHeroItemProps {
  hero: ICharacter;
}

export const HeroItem: FC<IHeroItemProps> = memo(({ hero }) => {
  if (!hero) {
    return null;
  }
  return (
    <Grid className="page hero-item" container direction="column">
      <Grid item container sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Grid item xs={12} md={4}>
          <HeroImage src={hero.image} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ marginRight: 1 }}>Name :</Typography>
            <Typography> {hero.name}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ marginRight: 1 }}>Race :</Typography>
            <Typography> {hero.race.name}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ marginRight: 1 }}>Class :</Typography>
            <Typography> {hero.class.name}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ marginRight: 1 }}>Abilities :</Typography>
          <Typography>
            not implementd yet, missing name of abilities in the interface
            ICharacter
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
});
