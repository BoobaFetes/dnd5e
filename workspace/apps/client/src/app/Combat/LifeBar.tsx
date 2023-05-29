import { Box, LinearProgress, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

interface ILifeBarProps {
  value: number;
  maxValue: number;
}
export const LifeBar: FC<ILifeBarProps> = ({ value, maxValue }) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    // Met à jour la valeur de la barre de vie
    setCurrentValue(value);
  }, [value]);

  return currentValue > 0 ? (
    <Box sx={{ position: 'relative' }}>
      <LinearProgress
        variant="determinate"
        color="success"
        sx={{
          height: 21,
          backgroundColor: (theme) =>
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        value={(currentValue / maxValue) * 100}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography>{`${currentValue} / ${maxValue}`}</Typography>
      </Box>
    </Box>
  ) : (
    <Typography color="error">Mort</Typography>
  );
};

export default LifeBar;
