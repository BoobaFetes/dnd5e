import { gql } from '@apollo/client';
import { dto } from '../../..';

export type AbilityScoreResult = { abilityScore?: dto.Query['abilityScore'] };

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
