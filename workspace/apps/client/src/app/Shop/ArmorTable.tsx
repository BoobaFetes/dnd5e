import { Armor, ICharacter } from '@boobafetes/dnd5e-domain';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FC, memo } from 'react';
import { ArmorShopItem } from './ArmorShopItem';
import { useUtils } from './utils';

export const ArmorTable: FC<{
  armors: Armor[];
  hero: ICharacter;
  onSave(hero: ICharacter): void;
}> = memo(({ armors, hero, onSave }) => {
  const { has } = useUtils(hero);
  return (
    <Table sx={{ tableLayout: 'fixed' }} size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell align="center">Details</TableCell>
          <TableCell align="right">Price</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {armors.map((armor) => {
          const isOwned = has.thatArmor(armor);
          const shopItem = new ArmorShopItem(hero);
          return (
            <TableRow key={armor.index}>
              <TableCell>
                <Typography>{armor.name}</Typography>
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
                      onSave(shopItem.hero);
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
                    (armor.index === 'shield' && has.oneHandCount > 1) ||
                    (armor.index === 'shield' && has.twoHand)
                  }
                  onClick={() => {
                    if (shopItem.buy(armor)) {
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
