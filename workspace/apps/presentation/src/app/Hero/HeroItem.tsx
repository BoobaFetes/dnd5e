import { FC, memo } from 'react';

interface IHeroItemProps {
  edit?: true;
}
export const HeroItem: FC<IHeroItemProps> = memo(({ edit }) => {
  return (
    <>
      <p>hero item page</p>
      <p>edit mode : {edit ? 'active' : 'disabled'}</p>
    </>
  );
});
