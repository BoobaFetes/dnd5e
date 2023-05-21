import { useQueryRace } from '@boobafetes/dnd5e-api';
import { QueryRaceArgs } from '@boobafetes/dnd5e-domain';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import { FC, memo } from 'react';
import { useParams } from 'react-router-dom';

export const RaceItem: FC<QueryRaceArgs> = memo(({ index }) => {
  const { race: param } = useParams<{ race: string }>();

  const {
    data: { race } = { race: undefined },
    loading,
    error,
  } = useQueryRace({
    variables: { index: index ?? param },
    skip: !index && !param,
  });

  return (
    <>
      {loading && 'loading...'}
      {error && error.message}
      {!!race && (
        <Grid container spacing={2}>
          <Grid item container>
            <Typography>{race.name}</Typography>
          </Grid>
          <Grid item container>
            {!!race.ability_bonuses.length &&
              race.ability_bonuses.map((abilityBonuses, index) => (
                <Accordion style={{ width: '100%' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index + 1}a-content`}
                    id={`panel${index + 1}a-content`}
                  >
                    <Typography>
                      {abilityBonuses.ability_score.full_name}
                    </Typography>
                    <Typography>(bonus : {abilityBonuses.bonus})</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{abilityBonuses.ability_score.desc}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
          </Grid>
        </Grid>
      )}
    </>
  );
});
