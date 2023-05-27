import { useQueryRaces } from '@boobafetes/dnd5e-api';
import { FC, memo } from 'react';
import { Link } from 'react-router-dom';

export const RaceList: FC = memo(() => {
  const { data: { races } = { races: [] }, loading, error } = useQueryRaces();

  return (
    <>
      {loading && 'loading ...'}
      {error && error.message}
      {!!races.length && (
        <ul>
          {races.map((race) => {
            return (
              <li key={race.index}>
                <Link to={`/race/${race.index}`}>{race.name}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
});
