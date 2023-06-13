import { useQueryClasses, useQueryRaces } from '@boobafetes/dnd5e-api';
import { RefreshOutlined, ShuffleOutlined } from '@mui/icons-material';
import {
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
import { FC, memo } from 'react';
import { HeroAbilities } from '../HeroAbilities';
import { HeroImage } from '../HeroImage';
import { getImageBySrc } from './useHeroImage';
import { useNewHero } from './useNewHero';

export const HeroCreator: FC = memo(() => {
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

  const {
    hero,
    nextImage,
    previousImage,
    setClass,
    abilities,
    setName,
    setRace,
    setRandomName,
    validate,
    save,
  } = useNewHero({
    races,
    classes,
    loading: classesLoading || racesLoading,
  });
  const loading = classesLoading || racesLoading;

  return !hero ? null : (
    <Grid
      className="page hero-creator"
      container
      direction="column"
      wrap="nowrap"
      sx={{ padding: 2, overflow: 'auto' }}
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
          <Grid
            item
            container
            justifyContent="center"
            wrap="nowrap"
            sx={{ padding: 1 }}
          >
            <HeroImage src={hero.image} />
          </Grid>
          <Grid
            item
            container
            wrap="nowrap"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Button onClick={previousImage}>Prevous</Button>
            <Typography>{getImageBySrc(hero.image).label} </Typography>
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
                variant="standard"
                onChange={({ target: { value: name } }) => setName(name)}
              />
            </Grid>
            <Grid item flexGrow={0}>
              <Button onClick={setRandomName}>
                <ShuffleOutlined />
              </Button>
            </Grid>
          </Grid>
          <Grid item container direction="column" sx={{ marginTop: 3 }}>
            <InputLabel id="hero-race-select-label">Race</InputLabel>
            <Select
              labelId="hero-race-select-label"
              id="hero-race-select"
              value={hero.race.index}
              label="Race"
              onChange={({ target: { value } }) => setRace(value)}
              readOnly={loading}
            >
              {races.map((race) => (
                <MenuItem key={race.index} value={race.index}>
                  {race.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item container direction="column" sx={{ marginTop: 3 }}>
            <InputLabel id="hero-class-select-label">Class</InputLabel>
            <Select
              labelId="hero-class-select-label"
              id="hero-class-select"
              value={hero.class.index}
              label="Race"
              onChange={({ target: { value } }) => setClass(value)}
              readOnly={loading}
            >
              {classes.map((c) => (
                <MenuItem key={c.index} value={c.index}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid
            item
            container
            wrap="nowrap"
            alignItems="center"
            sx={{ marginTop: 3 }}
          >
            <Grid item container>
              <Typography>{`Health : ${hero.health}`}</Typography>
            </Grid>
            <Grid item container>
              <Typography>{`Gold : ${hero.gold}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container sx={{ marginTop: { xs: 4, md: 2 } }}>
        <Paper sx={{ padding: 2 }}>
          <FormControl fullWidth>
            <Grid container>
              <Grid
                item
                container
                alignItems="center"
                sx={{ paddingBottom: 1, borderBottom: '1px solid' }}
              >
                <Typography sx={{ flexGrow: 1 }}>
                  Remaining points : {abilities.remainingPoints}
                </Typography>
                <Button fullWidth={false} onClick={abilities.randomize}>
                  <RefreshOutlined />
                </Button>
              </Grid>
              <HeroAbilities abilities={hero.abilities} action={abilities} />
            </Grid>
          </FormControl>
        </Paper>
      </Grid>
      <Grid item container sx={{ padding: 2 }} alignItems="flex-end">
        <Button disabled={!validate()} onClick={save}>
          Save
        </Button>
      </Grid>
    </Grid>
  );
});
