import { AbilityScore, Class, IHero, Race } from '@boobafetes/dnd5e-domain';
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
import { FC, memo, useState } from 'react';
import { HeroImage } from '../HeroImage';
import { useHeroAbilityCreator } from './useHeroAbilityCreator';
import { useHeroImage } from './useHeroImage';
import { useHeroRandomName } from './useHeroRandomName';

interface IHeroCreatorProps {
  hero: IHero;
  races: Race[];
  classes: Class[];
  abilityScores: AbilityScore[];
  loading?: boolean;
  error?: string;
  onSave(hero: IHero): void;
}

export const HeroCreator: FC<IHeroCreatorProps> = memo(
  ({ abilityScores, classes, hero, onSave, races, error, loading }) => {
    const [current, setCurrent] = useState<IHero>(hero);

    const { nextImage, currentImage, previousImage } = useHeroImage({
      onChange(image) {
        setCurrent({ ...current, img: image.src });
      },
    });
    const { roll } = useHeroRandomName();

    const { actionAbilityScore, randomizeAbilityScore, remainingAbilityScore } =
      useHeroAbilityCreator(current, setCurrent);

    return (
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
            <Grid item container justifyContent="center" wrap="nowrap">
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
                value={current.race}
                label="Race"
                onChange={({ target: { value: race } }) =>
                  setCurrent({ ...current, race })
                }
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
                value={current.class}
                label="Race"
                onChange={({ target: { value } }) =>
                  setCurrent({ ...current, class: value })
                }
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
                          {current.abilities[abilityScore.index]}
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
          <Button onClick={() => onSave({ ...current, img: currentImage.src })}>
            Save
          </Button>
        </Grid>
      </Grid>
    );
  }
);
