import {
  HeroRepository,
  HeroRepositoryClass,
  useQueryArmors,
  useQueryWeapons,
} from '@boobafetes/dnd5e-api';
import {
  Armor,
  EquipmentCategory,
  ICharacter,
  Weapon,
} from '@boobafetes/dnd5e-domain';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import { FC, memo, useState } from 'react';
import { HeroItem } from '../Hero/HeroItem';
import { ArmorTable } from './ArmorTable';
import { WeaponTable } from './WeaponTable';

interface IHeroShopProps {
  index: string;
  heroRepository?: HeroRepositoryClass;
}

type WeaponsByCategory = {
  category: EquipmentCategory;
  weapons: Weapon[];
};
type ArmorsByCategory = { category: EquipmentCategory; armors: Armor[] };

export const HeroShop: FC<IHeroShopProps> = memo(
  ({ index, heroRepository = HeroRepository }) => {
    const [hero, setHero] = useState<ICharacter>(heroRepository.get(index));
    const [heroSectionExpanded, setHeroSectionExpanded] = useState(true);
    const save = (hero: ICharacter) => {
      if (heroRepository.update(hero)) {
        setHero(heroRepository.get(hero.index));
      }
    };

    const [armorsByCategory, setArmorsByCategory] = useState<
      ArmorsByCategory[] | undefined
    >();
    const [weaponsByCategory, setWeaponsByCategory] = useState<
      WeaponsByCategory[] | undefined
    >();

    useQueryArmors({
      onCompleted({ armors }) {
        const _record: Record<string, ArmorsByCategory> = {};

        for (const armor of armors) {
          const category = armor.armor_category;

          if (!_record[category.index]) {
            _record[category.index] = { category, armors: [] };
          }

          _record[category.index].armors.push(armor);
        }

        setArmorsByCategory(Object.values(_record));
      },
    });

    useQueryWeapons({
      onCompleted({ weapons }) {
        const _record: Record<string, WeaponsByCategory> = {};

        for (const weapon of weapons) {
          const category = weapon.weapon_category;

          if (!_record[category.index]) {
            _record[category.index] = { category, weapons: [] };
          }
          _record[category.index].weapons.push(weapon);
        }

        for (const catIndex of Object.keys(_record)) {
          _record[catIndex].weapons.sort((a, b) => {
            return a.weapon_range > b.weapon_range
              ? -1
              : a.weapon_range < b.weapon_range
              ? 1
              : a.name > b.name
              ? 1
              : a.name < b.name
              ? -1
              : 0;
          });
        }
        setWeaponsByCategory(Object.values(_record));
      },
    });

    return (
      <Grid container direction="column" wrap="nowrap">
        <Grid item sx={{ marginTop: 3, marginBottom: 1 }}>
          <Accordion
            expanded={heroSectionExpanded}
            onChange={() => setHeroSectionExpanded(!heroSectionExpanded)}
          >
            <AccordionSummary>Hero</AccordionSummary>
            <AccordionDetails>
              <HeroItem hero={hero} />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item sx={{ marginTop: 3, marginBottom: 1 }}>
          <Typography>Shop</Typography>
        </Grid>
        <Grid
          item
          container
          direction="row"
          sx={{
            gap: {
              xs: 0,
              md: 1,
            },
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
          }}
          wrap="nowrap"
        >
          <Grid item>
            <Accordion>
              <AccordionSummary>Armors</AccordionSummary>
              <AccordionDetails>
                {armorsByCategory?.map(({ category, armors }) => {
                  return (
                    <Accordion>
                      <AccordionSummary>{category.name}</AccordionSummary>
                      <AccordionDetails>
                        <ArmorTable
                          hero={hero}
                          armors={armors.filter(({ str_minimum }) => {
                            return str_minimum <= hero.abilities.str.value;
                          })}
                          onSave={save}
                        />
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </AccordionDetails>
            </Accordion>
            <Typography></Typography>
          </Grid>
          <Grid item>
            <Accordion>
              <AccordionSummary>Weapons</AccordionSummary>
              <AccordionDetails>
                {weaponsByCategory?.map(({ category, weapons }) => (
                  <Accordion>
                    <AccordionSummary>{category.name}</AccordionSummary>
                    <AccordionDetails>
                      <WeaponTable
                        hero={hero}
                        weapons={weapons}
                        onSave={save}
                      />
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
    );
  }
);
