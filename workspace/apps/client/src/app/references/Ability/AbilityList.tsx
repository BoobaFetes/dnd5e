import { useQueryAbilityScores } from '@boobafetes/dnd5e-api';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { FC, memo } from 'react';
import { Link } from 'react-router-dom';

export const AbilityList: FC = memo(() => {
  const {
    data: { abilityScores } = { abilityScores: [] },
    loading,
    error,
  } = useQueryAbilityScores();

  return (
    <>
      {loading && 'loading ...'}
      {error && error.message}
      {abilityScores.map(({ index, full_name, desc }) => (
        <Accordion key={index} style={{ width: '100%' }}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-content`}
          >
            <Link to={`/ability/${index}`}>
              <Typography>{full_name}</Typography>
            </Link>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{desc}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
});
