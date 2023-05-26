// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Grid } from '@mui/material';
import clsx from 'clsx';
import { Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { Hero } from './Hero';
import { ResponsiveAppBar } from './ResponsiveAppBar';
import { Ability, Class, Race } from './references';

export function App() {
  return (
    <Grid
      container
      direction="column"
      wrap="nowrap"
      className={clsx('app', styles['root'])}
    >
      <Grid item className="app-bar">
        <ResponsiveAppBar
          pages={[
            { label: 'Home', to: '/' },
            { label: 'Heroes', to: '/hero' },
            { label: 'Races', to: '/race' },
            { label: 'Classes', to: '/class' },
            { label: 'Abilities', to: '/ability' },
          ]}
        />
      </Grid>
      <Grid
        item
        container
        direction="column"
        flexGrow={1}
        wrap="nowrap"
        sx={{ overflow: 'auto', paddingX: 2 }}
        className="app-content"
      >
        <Routes>
          <Route path="/" element={null} />
          <Route path="/hero/*" element={<Hero />} />
          <Route path="/race/*" element={<Race />} />
          <Route path="/class/*" element={<Class />} />
          <Route path="/ability/*" element={<Ability />} />
        </Routes>
      </Grid>
    </Grid>
  );
}

export default App;
