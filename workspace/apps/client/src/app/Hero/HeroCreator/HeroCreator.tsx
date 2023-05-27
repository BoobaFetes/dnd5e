import {
  HeroRepository,
  useQueryClasses,
  useQueryRaces,
} from '@boobafetes/dnd5e-api';
import { Dice, ICharacter, makeCharacter } from '@boobafetes/dnd5e-domain';
import { RefreshOutlined, ShuffleOutlined } from '@mui/icons-material';
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
import { useNavigate } from 'react-router-dom';
import { HeroAbilities } from '../HeroAbilities';
import { HeroImage } from '../HeroImage';
import { randomizeAbilityScrores } from './randomizeAbilityScrores';
import { useHeroAbilityCreator } from './useHeroAbilityCreator';
import { useHeroImage } from './useHeroImage';
import { useHeroRandomName } from './useHeroRandomName';

interface IHeroCreatorProps {
  heroRepository?: HeroRepository;
}

export const HeroCreator: FC<IHeroCreatorProps> = memo(
  ({ heroRepository = new HeroRepository() }) => {
    const navigate = useNavigate();

    const [current, setCurrent] = useState<ICharacter>();

    const {
      data: { races } = { races: [] },
      loading: racesLoading,
      error: racesError,
    } = useQueryRaces({
      onCompleted({ races }) {
        const index = Math.floor(Math.random() * races.length);
        setCurrent({
          ...current,
          race: { index: races[index]?.index, name: races[index]?.name },
        });
      },
    });

    const {
      data: { classes } = { classes: [] },
      loading: classesLoading,
      error: classesError,
    } = useQueryClasses({
      onCompleted({ classes }) {
        const index = Math.floor(Math.random() * classes.length);
        setCurrent({
          ...current,
          class: { index: classes[index]?.index, name: classes[index]?.name },
          gold:
            new Dice(getGoldDiceByClassIndex(classes[index]?.index)).roll() *
            10,
        });
      },
    });

    const onSave = (hero: ICharacter) => {
      if (heroRepository.add(hero)) {
        navigate(`/hero`);
      }
    };

    const { nextImage, currentImage, previousImage } = useHeroImage({
      onChange(image) {
        setCurrent({ ...current, image: image.src });
      },
    });
    const { roll } = useHeroRandomName();

    const { actionAbilityScore, randomizeAbilityScore, remainingAbilityScore } =
      useHeroAbilityCreator(current, setCurrent);

    useEffect(() => {
      setCurrent(
        makeCharacter({
          name: roll(),
          abilities: randomizeAbilityScrores(),
        })
      );
    }, [roll]);

    const loading = classesLoading || racesLoading;

    return !current ? null : (
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
              <HeroImage src={currentImage.src} />
            </Grid>
            <Grid
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
                  value={current.name}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  onChange={({ target: { value: name } }) =>
                    setCurrent({ ...current, name })
                  }
                />
              </Grid>
              <Grid item flexGrow={0}>
                <Button
                  onClick={() => {
                    setCurrent({ ...current, name: roll() });
                  }}
                >
                  <ShuffleOutlined />
                </Button>
              </Grid>
            </Grid>
            <Grid item container direction="column" sx={{ marginTop: 3 }}>
              <InputLabel id="current-race-select-label">Race</InputLabel>
              <Select
                labelId="current-race-select-label"
                id="current-race-select"
                value={current.race.index}
                label="Race"
                onChange={({ target: { value } }) => {
                  const race = races.find((r) => r.index === value);
                  setCurrent({
                    ...current,
                    race: { index: race?.index, name: race?.name },
                  });
                }}
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
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="current-race-select-label"
                id="current-race-select"
                value={current.class.index}
                label="Race"
                onChange={({ target: { value } }) => {
                  const classObj = classes.find((r) => r.index === value);

                  setCurrent({
                    ...current,
                    class: { index: classObj?.index, name: classObj?.name },
                    gold:
                      new Dice(
                        getGoldDiceByClassIndex(classObj?.index)
                      ).roll() * 10,
                  });
                }}
                readOnly={loading}
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
          <Grid item xs={6} sx={{ paddingRight: 0.75 }}>
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
                      Remaining points : {remainingAbilityScore}
                    </Typography>
                    <Button fullWidth={false} onClick={randomizeAbilityScore}>
                      <RefreshOutlined />
                    </Button>
                  </Grid>
                  <HeroAbilities
                    abilities={current.abilities}
                    action={actionAbilityScore}
                  />
                </Grid>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={6} sx={{ paddingLeft: 0.75 }}>
            <Paper sx={{ padding: 2, height: '100%' }}>
              <Box
                sx={{
                  height: 'inherit',
                  width: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: 2,
                }}
              >
                <div>
                  <Typography>{`Gold : ${current.gold}`}</Typography>
                </div>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Grid item container sx={{ padding: 2 }} alignItems="flex-end">
          <Button
            onClick={() => onSave({ ...current, image: currentImage.src })}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    );
  }
);

function getGoldDiceByClassIndex(classIndex: string) {
  let goldDice: string;
  switch (classIndex) {
    case 'barbarian':
      goldDice = '2d4';
      break;
    case 'bard':
      goldDice = '5d4';
      break;
    case 'cleric':
      goldDice = '5d4';
      break;
    case 'druid':
      goldDice = '2d4';
      break;
    case 'fighter':
      goldDice = '5d4';
      break;
    case 'monk':
      goldDice = '5d4';
      break;
    case 'paladin':
      goldDice = '5d4';
      break;
    case 'ranger':
      goldDice = '5d4';
      break;
    case 'rogue':
      goldDice = '4d4';
      break;
    case 'sorcerer':
      goldDice = '4d4';
      break;
    case 'warlock':
      goldDice = '3d4';
      break;
    case 'wizard':
      goldDice = '4d4';
      break;
    default:
      goldDice = 'd0';
  }
  return goldDice;
}
