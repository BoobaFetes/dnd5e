import { gql } from '@apollo/client';
import { dto } from '../../..';

export type RaceResult = { race?: dto.Query['race'] };

export const queryRace = gql`
  query Race($index: String!) {
    race(index: $index) {
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
