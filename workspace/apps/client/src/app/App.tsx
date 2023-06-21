// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Box, Grid } from '@mui/material';
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
    <Box role="alert" sx={{ padding: 1 }}>
      <img
        style={{ objectFit: 'cover', width: '100%' }}
        src="assets/band_error.jpg"
        alt="tu peux pas voir mais y a un truc qui déchire grave"
      />
      <p>Attention aux géants de feu !!!</p>
      <p>clique ci-dessous pour être réapparaître à la page d'acceuil.</p>
      <button
        onClick={() => {
          resetBoundary();
          window.location.replace('/');
        }}
      >
        retour à l'acceuil
      </button>
      <p>
        tu pourra essayer de corriger le problème avec la section qui y est
        dédiée
      </p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </Box>
  );
}
export default withErrorBoundary(App, {
  FallbackComponent: ErrorFallback,
});
