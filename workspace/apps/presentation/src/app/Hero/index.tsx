import { FC, memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HeroCreator } from './HeroCreator';
import { HeroItem } from './HeroItem';
import { HeroList } from './HeroList';

export const Hero: FC = memo(() => {
  return (
    <Routes>
      <Route path="/*">
        <Route index element={<HeroList />} />
        <Route path="create" element={<HeroCreator create />} />
        <Route path=":id" element={<HeroItem />} />
      </Route>
    </Routes>
  );
});
