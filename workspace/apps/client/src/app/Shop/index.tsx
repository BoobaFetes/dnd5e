import { FC, memo } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { HeroShop } from './HeroShop';

export const Shop: FC = memo(() => {
  return (
    <Routes>
      <Route path="/:characterIndex" element={<HeroShopBinding />} />
    </Routes>
  );
});

const HeroShopBinding: FC = () => {
  const { characterIndex } = useParams<{ characterIndex: string }>();
  return <HeroShop index={characterIndex} />;
};
