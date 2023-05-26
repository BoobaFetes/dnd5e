import { FC, memo } from 'react';

export const HeroImage: FC<Pick<HTMLImageElement, 'src'>> = memo(({ src }) => {
  return (
    <img
      style={{
        width: '100%',
        height: '100%',
        maxWidth: 300,
        maxHeight: 300,
        objectFit: 'contain',
      }}
      alt="your hero"
      src={src}
    />
  );
});
