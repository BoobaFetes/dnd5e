import { gql } from '@apollo/client';
import { Query } from '@boobafetes/dnd5e-domain';

export type AbilityScoresResult = {
  abilityScores?: Query['abilityScores'];
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
