// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HeroRepository } from '@boobafetes/dnd5e-api';
import { Grid } from '@mui/material';
import clsx from 'clsx';
import { useErrorBoundary, withErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { Duel } from './Combat';
import { Hero } from './Hero';
import { Home } from './Home';
import { ResponsiveAppBar } from './ResponsiveAppBar';
import { Shop } from './Shop';
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
        sx={{ overflow: 'auto', padding: 2 }}
        className="app-content"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hero/*" element={<Hero />} />
          <Route path="/shop/*" element={<Shop />} />
          <Route path="/race/*" element={<Race />} />
          <Route path="/class/*" element={<Class />} />
          <Route path="/ability/*" element={<Ability />} />
          <Route path="/combat/duel/:one/:two" element={<Duel />} />
        </Routes>
      </Grid>
    </Grid>
  );
}

function ErrorFallback({ error }) {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button
        onClick={() => {
          HeroRepository.reset();
          resetBoundary();
        }}
      >
        Try again
      </button>
    </div>
  );
}
export default withErrorBoundary(App, {
  FallbackComponent: ErrorFallback,
});
