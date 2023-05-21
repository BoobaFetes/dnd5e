import { gql } from '@apollo/client';
import { dto } from '../../..';

export type ClassResult = { class?: dto.Query['class'] };

export const queryClass = gql`
  query Class($index: String!) {
    class(index: $index) {
      index
      name
      hit_die
      proficiencies {
        index
        name
        type
      }
      saving_throws {
        index
        full_name
      }
      spellcasting {
        info {
          name
          desc
        }
        spellcasting_ability {
          index
          name
          full_name
        }
      }
      spells(
        order: { direction: ASCENDING, by: LEVEL, then_by: { by: NAME } }
      ) {
        index
        name
        level
        ritual
        school {
          index
          name
        }
        casting_time
        concentration
        attack_type
        damage {
          damage_type {
            index
            name
            desc
          }
          damage_at_slot_level {
            level
            damage
          }
          damage_at_character_level {
            level
            damage
          }
        }
        area_of_effect {
          type
          size
        }
        concentration
      }
    }
  }
`;
