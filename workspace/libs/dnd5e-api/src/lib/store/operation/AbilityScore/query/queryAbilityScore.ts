import { gql } from '@apollo/client';
import { Query } from '@boobafetes/dnd5e-domain';

export type AbilityScoreResult = { abilityScore?: Query['abilityScore'] };

export const queryAbilityScore = gql`
  query AbilityScore($index: String) {
    abilityScore(index: $index) {
      index
      name
      full_name
      desc
      skills(order_direction: ASCENDING) {
        index
        name
        desc
      }
    }
  }
`;
