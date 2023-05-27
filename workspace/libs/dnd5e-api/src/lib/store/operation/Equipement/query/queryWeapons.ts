import { gql } from '@apollo/client';
import { Weapon } from '@boobafetes/dnd5e-domain';

export type WeaponsResult = {
  weapons: Weapon[];
};

export const queryWeapons = gql`
  query Weapons {
    weapons: equipments(equipment_category: "weapon", order: { by: NAME }) {
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
      ... on Weapon {
        index
        name
        weight
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
      }
    }
  }
`;
