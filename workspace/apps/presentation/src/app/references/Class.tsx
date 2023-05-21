import { useQueryClasses } from '@boobafetes/dnd5e-api';
import { ClassItem, ClassList } from '@boobafetes/dnd5e-application';
import { FC, memo } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { IPage, NavBand } from '../NavBand';

export const Class: FC = memo(() => {
  const {
    data: { classes } = { classes: [] },
    loading,
    error,
  } = useQueryClasses();

  const details: IPage[] = error
    ? []
    : loading
    ? [{ label: 'loading...', to: '/class' }]
    : classes.map(({ index, name }) => ({
        label: name,
        to: `/class/${index}`,
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
        <Route index element={<ClassList />} />
        <Route path=":race" element={<ClassItem />} />
      </Route>
    </Routes>
  );
});
