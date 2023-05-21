import { FC, memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HeroCreate, HeroEdit } from './HeroCreator';
import { HeroList } from './HeroList';

export const Hero: FC = memo(() => {
  return (
    <Routes>
      <Route path="/*">
        <Route index element={<HeroList />} />
        <Route path="edit/*">
          <Route index element={<HeroCreate />} />
          <Route path=":id" element={<HeroEdit />} />
        </Route>
      </Route>
    </Routes>
  );
});
