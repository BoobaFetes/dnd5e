import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/hero');
  });
  return null;
};
