import { IHero } from '@boobafetes/dnd5e-domain';
import { Box, Button, Grid, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { HeroImage } from './HeroImage';

interface IHeroItemProps {
  hero: IHero;
  onEdit?(): void;
}

export const HeroItem: FC<IHeroItemProps> = memo(({ hero, onEdit }) => {
  return (
    <Grid className="page hero-item" container direction="column">
      <Grid item container justifyContent="center">
        <Button onClick={onEdit}>Edit</Button>
      </Grid>
      <Grid item container sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Grid item xs={12} md={4}>
          <HeroImage src={hero.img} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ marginRight: 1 }}>Name :</Typography>
            <Typography> {hero.name}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ marginRight: 1 }}>Race :</Typography>
            <Typography> {hero.race}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ marginRight: 1 }}>Class :</Typography>
            <Typography> {hero.class}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ marginRight: 1 }}>Abilities :</Typography>
          <Typography> {hero.class}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
});
