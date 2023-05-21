import { gql } from '@apollo/client';
import { dto } from '../../..';

export type RacesResult = { races: dto.Query['races'] };

export const queryRaces = gql`
  query Races {
    races {
      index
      name
      ability_bonuses {
        bonus
        ability_score {
          index
          name
          full_name
          desc
          skills {
            index
            name
            desc
          }
        }
      }
      ability_bonus_options {
        choose
        type
        from {
          option_set_type
          options {
            option_type
            bonus
            ability_score {
              index
              name
              full_name
            }
          }
        }
      }
    }
  }
`;
