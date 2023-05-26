import { FC, memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HeroCreator } from './HeroCreator';
import { HeroList } from './HeroList';

export const Hero: FC = memo(() => {
  return (
    <Routes>
      <Route path="/*">
        <Route index element={<HeroList />} />
        <Route path="create" element={<HeroCreator />} />
      </Route>
    </Routes>
  );
});
