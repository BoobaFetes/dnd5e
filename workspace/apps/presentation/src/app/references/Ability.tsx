import { useQueryAbilityScores } from '@boobafetes/dnd5e-api';
import { AbilityItem, AbilityList } from '@boobafetes/dnd5e-application';
import { FC, memo } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { IPage, NavBand } from '../NavBand';

export const Ability: FC = memo(() => {
  const {
    data: { abilityScores } = { abilityScores: [] },
    loading,
    error,
  } = useQueryAbilityScores();

  const details: IPage[] = error
    ? []
    : loading
    ? [{ label: 'loading...', to: '/ability' }]
    : abilityScores?.map((ability) => ({
        label: ability.full_name,
        to: `/ability/${ability.index}`,
      }));

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <NavBand
            pages={[
              { label: 'Home', to: '/' },
              { label: 'List', to: '/ability' },
              ...details,
            ]}
          >
            <Outlet />
          </NavBand>
        }
      >
        <Route index element={<AbilityList />} />
        <Route path=":ability" element={<AbilityItem />} />
      </Route>
    </Routes>
  );
});
