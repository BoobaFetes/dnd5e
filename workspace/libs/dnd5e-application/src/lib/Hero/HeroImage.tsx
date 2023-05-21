import { FC, memo } from 'react';

export const HeroImage: FC<Pick<HTMLImageElement, 'src'>> = memo(({ src }) => {
  return (
    <img
      style={{
        width: 300,
        height: 300,
        objectFit: 'contain',
        marginLeft: 16,
      }}
      alt="your hero"
      src={src}
    />
  );
});
