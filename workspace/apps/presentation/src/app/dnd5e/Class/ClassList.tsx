import { useQueryClasses } from '@boobafetes/dnd5e-api';
import { FC, memo } from 'react';
import { Link } from 'react-router-dom';

export const ClassList: FC = memo(() => {
  const {
    data: { classes } = { classes: [] },
    loading,
    error,
  } = useQueryClasses();

  return (
    <div>
      {loading && 'loading ...'}
      {error && error.message}
      {!!classes.length && (
        <ul>
          {classes.map((c) => {
            return (
              <li key={c.index}>
                <Link to={`/class/${c.index}`}>{c.name}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});
