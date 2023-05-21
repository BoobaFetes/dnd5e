import { useQueryClass } from '@boobafetes/dnd5e-api';
import { QueryClassArgs } from '@boobafetes/dnd5e-domain';
import { Grid, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { useParams } from 'react-router-dom';

export const ClassItem: FC<QueryClassArgs> = memo(({ index }) => {
  const { race: param } = useParams<{ race: string }>();

  const {
    data: { class: c } = { class: undefined },
    loading,
    error,
  } = useQueryClass({
    variables: { index: index ?? param },
    skip: !index && !param,
  });

  return (
    <>
      {loading && 'loading...'}
      {error && error.message}
      {!!c && (
        <Grid container spacing={2}>
          <Grid item container>
            <Typography>{c.name}</Typography>
          </Grid>
          {/* <Grid item container>
            {!!c.ability_bonuses.length &&
              c.ability_bonuses.map((abilityBonuses, index) => (
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
          </Grid> */}
        </Grid>
      )}
    </>
  );
});
