import { useQueryRaces } from '@boobafetes/dnd5e-api';
import { FC, memo } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { IPage, NavBand } from '../../NavBand';
import { RaceItem } from './RaceItem';
import { RaceList } from './RaceList';

export const Race: FC = memo(() => {
  const { data: { races } = { races: [] }, loading, error } = useQueryRaces();

  const details: IPage[] = error
    ? []
    : loading
    ? [{ label: 'loading...', to: '/race' }]
    : races.map(({ index, name }) => ({
        label: name,
        to: `/race/${index}`,
      }));

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <NavBand
            pages={[
              { label: 'Home', to: '/' },
              { label: 'List', to: '/race' },
              ...details,
            ]}
          >
            <Outlet />
          </NavBand>
        }
      >
        <Route index element={<RaceList />} />
        <Route path=":race" element={<RaceItem />} />
      </Route>
    </Routes>
  );
});
