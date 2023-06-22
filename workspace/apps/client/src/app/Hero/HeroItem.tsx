import { ICharacter } from '@boobafetes/dnd5e-domain';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FC, memo } from 'react';
import { HeroAbilities } from './HeroAbilities';
import { HeroImage } from './HeroImage';

interface IHeroItemProps {
  hero: ICharacter;
}

export const HeroItem: FC<IHeroItemProps> = memo(({ hero }) => {
  if (!hero) {
    return null;
  }
  return (
    <Grid className="page hero-item" container direction="column">
      <Grid item container sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={4} sx={{ paddingX: 1 }}>
          <HeroImage src={hero.image} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid item container>
            <Typography sx={{ marginRight: 1 }}>Name :</Typography>
            <Typography> {hero.name}</Typography>
          </Grid>
          <Grid item container>
            <Grid item container xs={6}>
              <Typography sx={{ marginRight: 1 }}>Class :</Typography>
              <Typography> {hero.class.name}</Typography>
            </Grid>
          </Grid>
          <Grid item container sx={{ marginTop: 2 }}>
            <Grid item container xs={6}>
              <Typography>{`Health : ${hero.health}`}</Typography>
            </Grid>
            <Grid item container xs={6}>
              <Typography>{`Gold : ${hero.gold}`}</Typography>
            </Grid>
          </Grid>
          <Grid item sx={{ marginTop: 2 }}>
            <Typography variant="h5">Abilities</Typography>{' '}
            <HeroAbilities abilities={hero.abilities} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container xs={12} sx={{ marginTop: 2 }} direction="column">
        <Typography variant="h5">Equipements</Typography>
        <Table sx={{ tableLayout: 'fixed' }} size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3}>
                <Typography variant="body1">Armors</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hero.equipement.armors?.map(
              ({ index, name, armor_category, armor_class }) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="caption">{name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {armor_category.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="caption">
                        {`base ${armor_class.base}`}
                        {armor_class.dex_bonus ? (
                          <>
                            <br />
                            {`${
                              armor_class.max_bonus
                                ? `bonus max +${armor_class.max_bonus}`
                                : 'bonus'
                            }`}
                          </>
                        ) : (
                          ''
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
        <Table sx={{ tableLayout: 'fixed' }} size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3}>
                <Typography variant="body1">Weapons</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...hero.equipement.melees, hero.equipement.ranged]
              .filter((i) => !!i)
              .map(
                (
                  {
                    index,
                    name,
                    weapon_category,
                    damage,
                    two_handed_damage,
                    properties,
                  },
                  rIndex
                ) => {
                  const useTwoHandsOnly = !!properties.find(
                    (e) => e.index === 'two-handed'
                  );
                  return (
                    <TableRow key={rIndex}>
                      <TableCell>
                        <Typography variant="caption">{name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {weapon_category.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="caption">
                          {`${damage?.damage_dice}`}
                          {two_handed_damage &&
                            ` (${two_handed_damage.damage_dice})`}
                          {useTwoHandsOnly && ' - 2 hands only'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
});
