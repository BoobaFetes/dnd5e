import { gql } from '@apollo/client';
import { dto } from '../../..';

export type AbilityScoresResult = {
  abilityScores?: dto.Query['abilityScores'];
};

export const queryAbilityScores = gql`
  query AbilityScores {
    abilityScores {
      index
      name
      full_name
      desc
    }
  }
`;
