import { gql } from '@apollo/client';
import { Query } from '@boobafetes/dnd5e-domain';

export type RaceResult = { race?: Query['race'] };

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
