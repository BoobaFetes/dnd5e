import {
  HeroRepository,
  useQueryArmors,
  useQueryWeapons,
} from '@boobafetes/dnd5e-api';
import {
  Armor,
  EquipmentCategory,
  ICharacter,
  Weapon,
  WeaponRange,
} from '@boobafetes/dnd5e-domain';
import { Inventory } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import { FC, Fragment, memo, useState } from 'react';
import { HeroItem } from '../Hero/HeroItem';
import { ArmorShopItem } from './ArmorShopItem';
import { WeaponShopItem } from './WeaponShopItem';

interface IHeroShopProps {
  index: string;
  heroRepository?: HeroRepository;
}

type WeaponsByCategory = {
  category: EquipmentCategory;
  melee: Weapon[];
  ranged: Weapon[];
};
type ArmorsByCategory = { category: EquipmentCategory; armors: Armor[] };

export const HeroShop: FC<IHeroShopProps> = memo(
  ({ index, heroRepository = new HeroRepository() }) => {
    const [hero, setHero] = useState<ICharacter>(heroRepository.get(index));
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
            _record[category.index] = { category, melee: [], ranged: [] };
          }

          if (weapon.weapon_range === WeaponRange.Melee) {
            _record[category.index].melee.push(weapon);
          } else {
            _record[category.index].ranged.push(weapon);
          }
        }

        setWeaponsByCategory(Object.values(_record));
      },
    });

    return (
      <Grid container direction="column" wrap="nowrap">
        <Grid item sx={{ marginTop: 3, marginBottom: 1 }}>
          <Accordion>
            <AccordionSummary>Hero</AccordionSummary>
            <AccordionDetails>
              <HeroItem hero={hero} />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item sx={{ marginTop: 3, marginBottom: 1 }}>
          <Typography>Shop</Typography>
        </Grid>
        <Grid item>
          <Accordion>
            <AccordionSummary>Armors</AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'nowrap',
                }}
              >
                {armorsByCategory?.map(({ category, armors }) => {
                  return (
                    <Fragment key={category.index}>
                      <Typography>{category.name}</Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                        }}
                      >
                        {armors
                          .filter(({ str_minimum }) => {
                            return str_minimum <= hero.abilities.str.value;
                          })
                          .map((armor) => {
                            const isOwned = !!hero.equipement.armors.find(
                              (a) => a.index === armor.index
                            );
                            return (
                              <Button
                                key={armor.index}
                                sx={{ marginX: 2 }}
                                onClick={() => {
                                  const shopItem = new ArmorShopItem(hero);
                                  let shouldSave = false;
                                  if (isOwned) {
                                    shouldSave = shopItem.sell(armor);
                                  } else {
                                    shouldSave = shopItem.buy(armor);
                                  }
                                  if (shouldSave) {
                                    save(shopItem.hero);
                                  }
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    flexWrap: 'nowrap',
                                    alignItems: 'center',
                                  }}
                                >
                                  {isOwned && (
                                    <Inventory style={{ marginRight: 16 }} />
                                  )}
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      flexWrap: 'nowrap',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Typography>{`${armor.name} (${armor.cost.quantity} ${armor.cost.unit})`}</Typography>
                                    <Typography variant="caption">
                                      {`base ${armor.armor_class.base}`}
                                      {armor.armor_class.dex_bonus
                                        ? ` / bonus ${
                                            armor.armor_class.max_bonus
                                              ? `(max +${armor.armor_class.max_bonus})`
                                              : ''
                                          }`
                                        : ''}
                                    </Typography>
                                  </div>
                                </div>
                              </Button>
                            );
                          })}
                      </Box>
                    </Fragment>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
          <Typography></Typography>
        </Grid>
        <Grid item>
          <Accordion>
            <AccordionSummary>Weapons</AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'nowrap',
                }}
              >
                {weaponsByCategory?.map(({ category, melee, ranged }) => {
                  return (
                    <Fragment key={category.index}>
                      <Accordion>
                        <AccordionSummary>
                          <Typography>{category.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container>
                            {[...melee, ...ranged].map((weapon) => {
                              const isOwned = !!hero.equipement.armors.find(
                                (a) => a.index === weapon.index
                              );
                              return (
                                <Grid
                                  key={weapon.index}
                                  item
                                  container
                                  xs={12}
                                  md={3}
                                  flexWrap="nowrap"
                                >
                                  <Button
                                    sx={{ marginX: 2 }}
                                    onClick={() => {
                                      const shopItem = new WeaponShopItem(hero);
                                      let shouldSave = false;
                                      if (isOwned) {
                                        shouldSave = shopItem.sell(weapon);
                                      } else {
                                        shouldSave = shopItem.buy(weapon);
                                      }
                                      if (shouldSave) {
                                        save(shopItem.hero);
                                      }
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        flexWrap: 'nowrap',
                                        alignItems: 'center',
                                      }}
                                    >
                                      {isOwned && (
                                        <Inventory
                                          style={{ marginRight: 16 }}
                                        />
                                      )}
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          flexWrap: 'nowrap',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Typography>{`${weapon.name} (${weapon.cost.quantity} ${weapon.cost.unit})`}</Typography>
                                        <Typography variant="caption">
                                          {`${weapon.damage?.damage_dice}`}
                                          {weapon.two_handed_damage &&
                                            `(${weapon.two_handed_damage.damage_dice})`}
                                        </Typography>
                                      </div>
                                    </div>
                                  </Button>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Fragment>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
          <Typography></Typography>
        </Grid>
      </Grid>
    );
  }
);
