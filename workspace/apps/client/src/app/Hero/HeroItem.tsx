import { ICharacter } from '@boobafetes/dnd5e-domain';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { HeroAbilities } from './HeroAbilities';
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
      <Grid item container sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={4} sx={{ paddingX: 1 }}>
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
          <Box sx={{ display: 'flex', marginBottom: 2 }}>
            <Typography sx={{ marginRight: 1 }}>Class :</Typography>
            <Typography> {hero.class.name}</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex' }}>
            <HeroAbilities abilities={hero.abilities} />
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography sx={{ marginRight: 1, textDecoration: 'underline' }}>
            Equipements :
          </Typography>
          <Typography>{`Gold : ${hero.gold}`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
});
