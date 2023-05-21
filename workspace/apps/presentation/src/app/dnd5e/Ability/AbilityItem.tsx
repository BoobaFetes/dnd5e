import { useQueryAbilityScore } from '@boobafetes/dnd5e-api';
import { QueryAbilityScoreArgs } from '@boobafetes/dnd5e-domain';
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

export const AbilityItem: FC<QueryAbilityScoreArgs> = memo(({ index }) => {
  const { ability: param } = useParams<{ ability: string }>();

  const {
    data: { abilityScore } = { abilityScore: undefined },
    loading,
    error,
  } = useQueryAbilityScore({
    variables: { index: index ?? param },
    skip: !index && !param,
  });

  return (
    <>
      {loading && 'loading...'}
      {error && error.message}
      {!!abilityScore && (
        <Grid container spacing={2}>
          <Grid item container>
            <Typography component="h1">{abilityScore.full_name}</Typography>
          </Grid>
          <Grid item container>
            <Typography> {abilityScore.desc}</Typography>
          </Grid>
          <Grid item container>
            {!!abilityScore.skills &&
              abilityScore.skills.map((skill, index) => (
                <Accordion style={{ width: '100%' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index + 1}a-content`}
                    id={`panel${index + 1}a-content`}
                  >
                    <Typography>
                      {skill.name} ({skill.index})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{skill.desc}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
          </Grid>
        </Grid>
      )}
    </>
  );
});
