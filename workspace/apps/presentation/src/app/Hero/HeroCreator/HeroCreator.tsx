import {
  useQueryAbilityScores,
  useQueryClasses,
  useQueryRaces,
} from '@boobafetes/dnd5e-api';
import {
  AddCircleOutlineOutlined,
  RefreshOutlined,
  RemoveCircleOutlineOutlined,
  ShuffleOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { FC, memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HeroRepository, IHero, makeHero } from '../IHero';
import { PAGE_HEIGHT } from '../variables';
import { useHeroAbilityCreator } from './useHeroAbilityCreator';
import { useHeroImage } from './useHeroImage';
import { useHeroRandomName } from './useHeroRandomName';

interface IHeroCreatorProps {
  create?: true;
  edit?: true;
  heroRepository?: HeroRepository;
}

export const HeroCreator: FC<IHeroCreatorProps> = memo(
  ({ create, edit, heroRepository = new HeroRepository() }) => {
    const params = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const { nextImage, currentImage, previousImage } = useHeroImage();
    const { roll } = useHeroRandomName();

    const [hero, setHero] = useState<IHero>(
      create
        ? makeHero({ name: roll() })
        : edit && params.id
        ? heroRepository.get(params.id)
        : null
    );

    const { actionAbilityScore, randomizeAbilityScore, remainingAbilityScore } =
      useHeroAbilityCreator(hero, setHero);

    const { data: { abilityScores } = { abilityScores: undefined } } =
      useQueryAbilityScores();

    const {
      data: { races } = { races: [] },
      loading: racesLoading,
      error: racesError,
    } = useQueryRaces();

    const {
      data: { classes } = { classes: [] },
      loading: classesLoading,
      error: classesError,
    } = useQueryClasses();

    useEffect(() => {
      setHero({ ...hero, img: currentImage.src });
    }, [hero, currentImage.src]);

    return (
      <Grid
        className="hero-creator"
        container
        direction="column"
        wrap="nowrap"
        sx={{ height: PAGE_HEIGHT, padding: 2, overflow: 'auto' }}
      >
        <Grid item container>
          <Grid
            item
            container
            direction="column"
            wrap="nowrap"
            justifyContent="center"
            xs={12}
            md={4}
          >
            <Grid item container justifyContent="center" wrap="nowrap">
              <img
                style={{
                  width: 300,
                  height: 300,
                  objectFit: 'contain',
                  marginLeft: 16,
                }}
                alt="your hero"
                src={currentImage.src}
              />
            </Grid>
            <Grid
              sx={{ display: !create && !edit ? 'none' : undefined }}
              item
              container
              wrap="nowrap"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Button onClick={previousImage}>Prevous</Button>
              <Typography>{currentImage.label} </Typography>
              <Button onClick={nextImage}>Next</Button>
            </Grid>
          </Grid>
          <Grid item container direction="column" xs={12} md={8}>
            <Grid item container alignItems="flex-end">
              <Grid item flexGrow={1}>
                <TextField
                  fullWidth
                  id="standard-read-only-input"
                  label="Name"
                  value={hero.name}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  onChange={({ target: { value: name } }) =>
                    setHero({ ...hero, name })
                  }
                />
              </Grid>
              <Grid item flexGrow={0}>
                <Button
                  onClick={() => {
                    setHero({ ...hero, name: roll() });
                  }}
                >
                  <ShuffleOutlined />
                </Button>
              </Grid>
            </Grid>
            <Grid item container direction="column" sx={{ marginTop: 3 }}>
              <InputLabel id="hero-race-select-label">Race</InputLabel>
              <Select
                labelId="hero-race-select-label"
                id="hero-race-select"
                value={hero.race}
                label="Race"
                onChange={({ target: { value: race } }) =>
                  setHero({ ...hero, race })
                }
                readOnly={racesLoading}
              >
                {races.map((race) => (
                  <MenuItem key={race.index} value={race.index}>
                    {race.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item container direction="column" sx={{ marginTop: 3 }}>
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="hero-race-select-label"
                id="hero-race-select"
                value={hero.class}
                label="Race"
                onChange={({ target: { value } }) =>
                  setHero({ ...hero, class: value })
                }
                readOnly={classesLoading}
              >
                {classes.map((c) => (
                  <MenuItem key={c.index} value={c.index}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container sx={{ marginTop: { xs: 4, md: 2 } }}>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }}>
              <FormControl fullWidth>
                <Grid container>
                  <Grid
                    item
                    container
                    alignItems="center"
                    sx={{ paddingBottom: 1, borderBottom: '1px solid' }}
                  >
                    <Typography>
                      Remaining points : {remainingAbilityScore}
                    </Typography>
                    <Button
                      fullWidth={false}
                      sx={{ marginLeft: 2 }}
                      onClick={randomizeAbilityScore}
                    >
                      <RefreshOutlined />
                    </Button>
                  </Grid>
                  {abilityScores?.map((abilityScore, index) => {
                    return (
                      <Grid
                        item
                        container
                        alignItems="center"
                        sx={{ paddingTop: index === 0 ? 2 : 0 }}
                      >
                        <Typography sx={{ flexGrow: 1 }}>
                          {abilityScore.full_name}
                        </Typography>
                        <Typography sx={{ flexGrow: 0, width: 50 }}>
                          {hero.abilities[abilityScore.index]}
                        </Typography>
                        <Button
                          sx={{ flexGrow: 0 }}
                          onClick={actionAbilityScore(abilityScore.index).minus}
                        >
                          <RemoveCircleOutlineOutlined />
                        </Button>
                        <Button
                          sx={{ flexGrow: 0 }}
                          onClick={actionAbilityScore(abilityScore.index).plus}
                        >
                          <AddCircleOutlineOutlined />
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <Box sx={{ width: '50%', display: 'flex', marginTop: 2 }}></Box>
            </Paper>
          </Grid>
        </Grid>
        <Grid item container sx={{ padding: 2 }} alignItems="flex-end">
          <Button
            onClick={() => {
              heroRepository.add(hero);
              navigate('/hero');
            }}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    );
  }
);
