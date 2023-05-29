import { HeroRepository } from '@boobafetes/dnd5e-api';
import { ICharacter } from '@boobafetes/dnd5e-domain';
import { BedroomBabyOutlined } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import { FC, memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroItem } from './HeroItem';

interface IHeroListProps {
  heroRepository?: HeroRepository;
}
export const HeroList: FC<IHeroListProps> = memo(
  ({ heroRepository = new HeroRepository() }) => {
    const navigate = useNavigate();
    const [heroes, setHeroes] = useState<ICharacter[]>(heroRepository.all());

    const refresh = () => setHeroes(heroRepository.all());

    useEffect(() => {
      return heroRepository.subscribe((list) => {
        setHeroes([...list]);
      });
    }, [heroRepository, setHeroes]);

    const onAdd = () => navigate('/hero/create');
    const onUpdate = (hero: ICharacter) => heroRepository.update(hero);
    const onDelete = (hero: ICharacter) => heroRepository.remove(hero.index);

    return (
      <Grid
        className="page hero-list"
        container
        direction={'column'}
        wrap="nowrap"
      >
        <Grid item container justifyContent="center" wrap="nowrap">
          <Button onClick={onAdd}>Add</Button>
          <Button
            onClick={() => {
              navigate(
                '/combat/duel/' +
                  heroRepository
                    .all()
                    .filter((character) => character.selected)
                    .filter((_, index) => index < 2)
                    .map((i) => i.index)
                    .join('/')
              );
            }}
          >
            Duel
          </Button>
        </Grid>
        <Grid
          item
          container
          direction="column"
          wrap="nowrap"
          sx={{ flexGrow: 1, overflow: 'auto' }}
        >
          {heroes.map((hero) => {
            return (
              <Accordion key={hero.index}>
                <AccordionSummary>
                  {hero.selected && (
                    <BedroomBabyOutlined style={{ marginRight: 16 }} />
                  )}
                  <Typography>{hero.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'nowrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        sx={{ width: 100 }}
                        onClick={() => {
                          if (onUpdate({ ...hero, selected: !hero.selected })) {
                            refresh();
                          }
                        }}
                      >
                        <Typography>
                          {hero.selected ? 'Unselect' : 'Select'}
                        </Typography>
                      </Button>
                      <Button
                        sx={{ width: 100 }}
                        onClick={() => {
                          navigate(`/shop/${hero.index}`);
                        }}
                      >
                        <Typography>Shopping</Typography>
                      </Button>
                    </Box>
                    <Button
                      sx={{ width: 100, color: 'red' }}
                      onClick={() => onDelete(hero)}
                    >
                      <Typography>Delete</Typography>
                    </Button>
                  </Box>
                  <HeroItem hero={hero} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Grid>
      </Grid>
    );
  }
);
