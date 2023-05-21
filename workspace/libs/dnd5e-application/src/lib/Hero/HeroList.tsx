import { IHero } from '@boobafetes/dnd5e-domain';
import { Button, Grid, Paper, Typography } from '@mui/material';
import { FC, memo, useMemo } from 'react';
import { HeroItem } from './HeroItem';

interface IHeroListProps {
  heroes: IHero[];
  onAdd(): void;
  onEdit?(hero: IHero): void;
  onSelect(hero: IHero): void;
  onDelete(hero: IHero): void;
}

export const HeroList: FC<IHeroListProps> = memo(
  ({ heroes, onAdd, onEdit, onSelect, onDelete }) => {
    const selectedHero = useMemo(() => {
      return heroes.find((hero) => hero.selected);
    }, [heroes]);

    return (
      <Grid className="page hero-list" container>
        <Grid item container direction={'column'} xs={12} md={3}>
          <Grid item container justifyContent="center">
            <Button onClick={onAdd}>Add</Button>
          </Grid>
          <Grid item container sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <Paper
              sx={{ flexGrow: 1, overflowY: 'auto', margin: 1, padding: 1 }}
            >
              {!heroes.length && 'no saved hero'}
              {heroes.map((hero) => (
                <Button
                  sx={{ flexGrow: 1 }}
                  onClick={(evt) => {
                    evt.preventDefault();
                    onSelect(hero);
                  }}
                >
                  <Grid container key={hero.id}>
                    <Grid item xs={8}>
                      {hero.name}
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        onClick={(evt) => {
                          evt.stopPropagation();
                          onDelete(hero);
                        }}
                      >
                        <Typography color="red">Delete</Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </Button>
              ))}
            </Paper>
          </Grid>
        </Grid>
        <Grid item container direction={'column'} xs={12} md={9}>
          <Paper sx={{ flexGrow: 1, overflowY: 'auto', margin: 1, padding: 1 }}>
            <HeroItem hero={selectedHero} onEdit={() => onEdit(selectedHero)} />
          </Paper>
        </Grid>
      </Grid>
    );
  }
);
