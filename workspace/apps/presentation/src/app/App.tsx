// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { Hero } from './Hero';
import { ResponsiveAppBar } from './ResponsiveAppBar';
import { Ability, Class, Race } from './references';

export function App() {
  return (
    <div className={styles['root']}>
      <ResponsiveAppBar
        pages={[
          { label: 'Home', to: '/' },
          { label: 'Heroes', to: '/hero' },
          { label: 'Races', to: '/race' },
          { label: 'Classes', to: '/class' },
          { label: 'Abilities', to: '/ability' },
        ]}
      />
      <Routes>
        <Route path="/" element={null} />
        <Route path="/hero/*" element={<Hero />} />
        <Route path="/race/*" element={<Race />} />
        <Route path="/class/*" element={<Class />} />
        <Route path="/ability/*" element={<Ability />} />
      </Routes>
    </div>
  );
}

export default App;
