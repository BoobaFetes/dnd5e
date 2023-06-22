import { HeroRepository, HeroRepositoryClass } from '@boobafetes/dnd5e-api';
import { ICharacter } from '@boobafetes/dnd5e-domain';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Grid,
  Typography,
} from '@mui/material';
import { FC, memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroItem } from './HeroItem';

interface IHeroListProps {
  heroRepository?: HeroRepositoryClass;
}
export const HeroList: FC<IHeroListProps> = memo(
  ({ heroRepository = HeroRepository }) => {
    const navigate = useNavigate();
    const [heroes, setHeroes] = useState<ICharacter[]>(heroRepository.all());

    useEffect(() => {
      return heroRepository.subscribe((list) => {
        setHeroes([...list]);
      });
    }, [heroRepository, setHeroes]);

    const onAdd = () => navigate('/hero/create');

    const canMakeDuel = heroes.length >= 2;

    const onDuel = !canMakeDuel
      ? undefined
      : () => {
          let selectedHeros = heroes.filter((character) => character.selected);
          if (selectedHeros.length < 2) {
            selectedHeros = [
              ...selectedHeros,
              ...heroes.filter((h, i) => !h.selected && i < 2),
            ];
          }
          navigate(
            '/combat/duel/' +
              selectedHeros
                .filter((_, index) => index < 2)
                .map((i) => i.index)
                .join('/')
          );
        };
    const onDelete = (hero: ICharacter) => heroRepository.remove(hero.index);

    return (
      <Grid
        className="page hero-list"
        container
        direction={'column'}
        wrap="nowrap"
      >
        <Grid item container justifyContent="flex-start" wrap="nowrap">
          <Button onClick={onAdd} sx={{ marginRight: 1 }}>
            Add Hero
          </Button>
          <Button disabled={!canMakeDuel} onClick={onDuel}>
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
                  <Grid container alignItems="center">
                    <Grid item flexGrow={0}>
                      <Checkbox
                        checked={hero.selected}
                        onClick={(evt) => evt.stopPropagation()}
                        onChange={() =>
                          heroRepository.update({
                            ...hero,
                            selected: !hero.selected,
                          })
                        }
                      />
                    </Grid>
                    <Grid item flexShrink={0} flexGrow={0}>
                      <Typography>{hero.name}</Typography>
                    </Grid>
                    {!hero.equipement.armors?.length &&
                      !hero.equipement.melees?.length && (
                        <Grid item flexShrink={0} flexGrow={0}>
                          <Typography>
                            &nbsp;is naked.. You should buy some stuffs
                          </Typography>
                        </Grid>
                      )}
                    <Grid
                      item
                      container
                      flex="1 1 0px"
                      justifyContent="flex-end"
                    >
                      <Button
                        sx={{ width: 150 }}
                        onClick={(evt) => {
                          evt.stopPropagation();
                          navigate(`/shop/${hero.index}`);
                        }}
                      >
                        <Typography>Equipements</Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container direction="column" wrap="nowrap">
                    <Grid item>
                      <HeroItem hero={hero} />
                    </Grid>
                    <Grid item container justifyContent="flex-end">
                      <Button
                        sx={{
                          width: 100,
                          color: 'red',
                          marginTop: 5,
                          marginBottom: 2,
                        }}
                        onClick={() => onDelete(hero)}
                      >
                        <Typography>Delete</Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Grid>
      </Grid>
    );
  }
);
