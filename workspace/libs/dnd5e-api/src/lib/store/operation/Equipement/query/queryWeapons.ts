import { gql } from '@apollo/client';
import { Weapon } from '@boobafetes/dnd5e-domain';

export type WeaponsResult = {
  weapons: Weapon[];
};

export const queryWeapons = gql`
  query {
    weapons: equipments(equipment_category: "weapon", order: { by: NAME }) {
      index
      name
      cost {
        unit
        quantity
      }
      desc
      weight
      ... on Weapon {
        damage {
          damage_dice
          damage_type {
            index
            name
          }
        }
        two_handed_damage {
          damage_dice
          damage_type {
            index
            name
          }
        }
        weapon_category {
          index
          name
        }
        weapon_range
        properties {
          index
          name
          desc
        }
      }
    }
  }
`;
