import { Button, Grid, Paper, Typography } from '@mui/material';
import { FC, memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroRepository, IHero } from './IHero';
import { PAGE_HEIGHT } from './variables';

interface IHeroListProps {
  heroRepository?: HeroRepository;
}

export const HeroList: FC<IHeroListProps> = memo(
  ({ heroRepository = new HeroRepository() }) => {
    const navigate = useNavigate();
    const [myHeroes, setMyHeroes] = useState<IHero[]>(heroRepository.all());

    useEffect(() => {
      heroRepository.onChange = setMyHeroes;
      return () => {
        heroRepository.onChange = undefined;
      };
    }, [heroRepository, setMyHeroes]);

    const [selectedHeroId, setSelectedHeroId] = useState<string>('');
    const selectedHero = heroRepository.selected();

    return (
      <Grid className="hero-list" container sx={{ height: PAGE_HEIGHT }}>
        <Grid item container direction={'column'} xs={12} md={3}>
          <Grid item container justifyContent="center">
            <Button onClick={() => navigate('/hero/create')}>Add</Button>{' '}
          </Grid>
          <Grid item container sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <Paper
              sx={{ flexGrow: 1, overflowY: 'auto', margin: 1, padding: 1 }}
            >
              {!myHeroes.length && 'no saved hero'}
              {myHeroes.map((myHero) => (
                <Button
                  sx={{ flexGrow: 1 }}
                  onClick={(evt) => {
                    evt.preventDefault();
                    setSelectedHeroId(myHero.id);
                    heroRepository.select(myHero.id);
                  }}
                >
                  <Grid container key={myHero.id}>
                    <Grid item xs={8}>
                      {myHero.name}
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        onClick={(evt) => {
                          evt.stopPropagation();
                          heroRepository.remove(myHero.id);
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
            <p>id : {selectedHero?.id}</p>
            <p>name : {selectedHero?.name}</p>
            <p>
              <img alt="your hero" src={selectedHero?.img} />
            </p>
          </Paper>
        </Grid>
      </Grid>
    );
  }
);
