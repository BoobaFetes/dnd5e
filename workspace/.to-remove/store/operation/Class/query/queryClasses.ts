import { gql } from '@apollo/client';
import { dto } from '../../..';

export type ClassesResult = { classes: dto.Query['classes'] };

export const queryClasses = gql`
  query Classes {
    classes {
      index
      name
      hit_die
      proficiencies {
        index
        name
        type
      }
      saving_throws {
        index
        full_name
      }
      spellcasting {
        info {
          name
          desc
        }
        spellcasting_ability {
          index
          name
          full_name
        }
      }
    }
  }
`;
