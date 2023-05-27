import { gql } from '@apollo/client';
import { Armor } from '@boobafetes/dnd5e-domain';

export type ArmorsResult = {
  armors: Armor[];
};

export const queryArmors = gql`
  query Armors {
    armors: equipments(equipment_category: "armor", order: { by: NAME }) {
      index
      name
      cost {
        unit
        quantity
      }
      desc
      weight
      equipment_category {
        index
        name
      }
      ... on Armor {
        armor_category {
          index
          name
        }
        str_minimum
        armor_class {
          base
          dex_bonus
          max_bonus
        }
      }
    }
  }
`;
