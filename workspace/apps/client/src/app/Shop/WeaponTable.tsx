import { ICharacter, Weapon, WeaponRange } from '@boobafetes/dnd5e-domain';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FC, Fragment, memo } from 'react';
import { WeaponShopItem } from './WeaponShopItem';
import { useEquipementUtils } from './useEquipementUtils';

export const WeaponTable: FC<{
  weapons: Weapon[];
  hero: ICharacter;
  onSave(hero: ICharacter): void;
}> = memo(({ weapons, hero, onSave }) => {
  const { is, has } = useEquipementUtils(hero);
  return (
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
        {weapons.map((weapon) => {
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
                  .map((d, i) =>
                    d === '|' ? (
                      <br key={i} />
                    ) : (
                      <Fragment key={i}>{d}</Fragment>
                    )
                  )}
              </TableCell>
              <TableCell align="right">
                <Typography variant="caption">{`${weapon.cost.quantity} ${weapon.cost.unit}`}</Typography>
              </TableCell>
              <TableCell>
                <Button
                  disabled={!isOwned}
                  onClick={() => {
                    if (shopItem.sell(weapon)) {
                      onSave(shopItem.hero);
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
                        (is.twoHand(weapon) && has.oneHandCount > 0) ||
                        (has.shield && is.twoHand(weapon)) ||
                        (has.shield && has.oneHandCount >= 1) ||
                        (!has.shield && has.oneHandCount >= 2))) ||
                    (is.ranged(weapon) && has.ranged)
                  }
                  onClick={() => {
                    if (shopItem.buy(weapon)) {
                      onSave(shopItem.hero);
                    }
                  }}
                >
                  Buy
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
});
