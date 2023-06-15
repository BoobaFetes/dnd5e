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
  WeaponRange,
} from '@boobafetes/dnd5e-domain';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FC, memo, useMemo, useState } from 'react';
import { HeroItem } from '../Hero/HeroItem';
import { ArmorShopItem } from './ArmorShopItem';
import { WeaponShopItem } from './WeaponShopItem';

interface IHeroShopProps {
  index: string;
  heroRepository?: HeroRepositoryClass;
}

type WeaponsByCategory = {
  category: EquipmentCategory;
  melee: Weapon[];
  ranged: Weapon[];
};
type ArmorsByCategory = { category: EquipmentCategory; armors: Armor[] };

export const HeroShop: FC<IHeroShopProps> = memo(
  ({ index, heroRepository = HeroRepository }) => {
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

    const is = useMemo(
      () => ({
        ranged: (weapon: Weapon) => weapon.weapon_range === WeaponRange.Ranged,
        melee: (weapon: Weapon) => weapon.weapon_range === WeaponRange.Melee,
        ownedWeapon: (weapon: Weapon) =>
          weapon.properties.some((p) => p.index !== 'two-handed'),
        twoHand: (weapon: Weapon) =>
          weapon.properties.some((p) => p.index === 'two-handed'),
        oneHandAndTwoHand: (weapon: Weapon) =>
          weapon.properties.some((p) => p.index === 'versatile'),
      }),
      []
    );
    const has = useMemo(
      () => ({
        melee: hero.equipement.melees.some((w) => is.melee(w)),
        ranged: hero.equipement.melees.some((w) => is.ranged(w)),
        twoHand: hero.equipement.melees.some((w) =>
          w.properties.some((p) => p.index === 'two-handed')
        ),
        oneHandCount: hero.equipement.melees.filter(
          (w) => !w.properties.some((p) => p.index === 'two-handed')
        ).length,
        shield: hero.equipement.armors.some((a) => a.index === 'shield'),
        armor: hero.equipement.armors.some((a) => a.index !== 'shield'),
        thatArmor: (armor: Armor) =>
          hero.equipement.armors.some((a) => a.index === armor.index),
        thatWeapon: (weapon: Weapon) =>
          hero.equipement.ranged?.index === weapon.index ||
          hero.equipement.melees.some((w) => w.index === weapon.index),
      }),
      [hero.equipement, is]
    );

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
              <Table sx={{ tableLayout: 'fixed' }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="center">Details</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {armorsByCategory?.map(({ category, armors }) => {
                    return armors
                      .filter(({ str_minimum }) => {
                        return str_minimum <= hero.abilities.str.value;
                      })
                      .map((armor) => {
                        const isOwned = has.thatArmor(armor);
                        const shopItem = new ArmorShopItem(hero);
                        return (
                          <TableRow key={armor.index}>
                            <TableCell>
                              <Typography>{armor.name}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption">
                                {category.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="caption">
                                {`base ${armor.armor_class.base}`}
                                {armor.armor_class.dex_bonus ? (
                                  <>
                                    <br />
                                    {`${
                                      armor.armor_class.max_bonus
                                        ? `bonus max +${armor.armor_class.max_bonus}`
                                        : 'bonus'
                                    }`}
                                  </>
                                ) : (
                                  ''
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="caption">{`${armor.cost.quantity} ${armor.cost.unit}`}</Typography>
                            </TableCell>
                            <TableCell>
                              <Button
                                disabled={!isOwned}
                                onClick={() => {
                                  if (shopItem.sell(armor)) {
                                    save(shopItem.hero);
                                  }
                                }}
                              >
                                Sell
                              </Button>
                              <Button
                                disabled={
                                  isOwned ||
                                  hero.gold < armor.cost.quantity ||
                                  (armor.index !== 'shield' && has.armor) ||
                                  (armor.index === 'shield' &&
                                    has.oneHandCount > 1)
                                }
                                onClick={() => {
                                  if (shopItem.buy(armor)) {
                                    save(shopItem.hero);
                                  }
                                }}
                              >
                                Buy
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      });
                  })}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
          <Typography></Typography>
        </Grid>
        <Grid item>
          <Accordion>
            <AccordionSummary>Weapons</AccordionSummary>
            <AccordionDetails>
              <Table sx={{ tableLayout: 'fixed' }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="center">Damages</TableCell>
                    <TableCell align="center">Details</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weaponsByCategory?.map(({ category, melee, ranged }) => {
                    return [...melee, ...ranged].map((weapon) => {
                      if (weapon.damage === null) {
                        return null;
                      }
                      const isOwned = has.thatWeapon(weapon);
                      const shopItem = new WeaponShopItem(hero);
                      const details: string[] = [];
                      if (is.melee(weapon)) {
                        details.push(WeaponRange.Melee);
                      }
                      if (is.ranged(weapon)) {
                        details.push(WeaponRange.Ranged);
                      }
                      details.push(category.name);
                      if (is.oneHandAndTwoHand(weapon)) {
                        details.push('both hands');
                      } else if (is.twoHand(weapon)) {
                        details.push('two hands');
                      } else {
                        details.push('one hand');
                      }
                      return (
                        <TableRow key={weapon.index}>
                          <TableCell>
                            <Typography>{weapon.name}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="caption">
                              {`${weapon.damage?.damage_dice}`}
                              {weapon.two_handed_damage &&
                                ` (${weapon.two_handed_damage.damage_dice})`}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {details
                              .join('-|-')
                              .split('-')
                              .map((d) => (d === '|' ? <br /> : d))}
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="caption">{`${weapon.cost.quantity} ${weapon.cost.unit}`}</Typography>
                          </TableCell>
                          <TableCell>
                            <Button
                              disabled={!isOwned}
                              onClick={() => {
                                if (shopItem.sell(weapon)) {
                                  save(shopItem.hero);
                                }
                              }}
                            >
                              Sell
                            </Button>
                            <Button
                              disabled={
                                isOwned ||
                                hero.gold < weapon.cost.quantity ||
                                (is.melee(weapon) &&
                                  (has.twoHand ||
                                    (is.twoHand(weapon) &&
                                      has.oneHandCount > 0) ||
                                    (has.shield && is.twoHand(weapon)) ||
                                    (has.shield && has.oneHandCount >= 1) ||
                                    (!has.shield && has.oneHandCount >= 2))) ||
                                (is.ranged(weapon) && has.ranged)
                              }
                              onClick={() => {
                                if (shopItem.buy(weapon)) {
                                  save(shopItem.hero);
                                }
                              }}
                            >
                              Buy
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
          <Typography></Typography>
        </Grid>
      </Grid>
    );
  }
);
