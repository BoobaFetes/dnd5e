import { HeroRepository } from '@boobafetes/dnd5e-api';
import { BedroomBabyOutlined } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import { FC, ReactNode } from 'react';

export const Home: FC = () => {
  return (
    <Grid container spacing={1}>
      <Grid item container direction="column">
        <Accordion expanded>
          <AccordionSummary>
            <Typography variant="h4"> Aide rapide </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {aideSection.map(({ title, body }, index) => (
              <Accordion key={index}>
                <AccordionSummary>{title}</AccordionSummary>
                <AccordionDetails>{body}</AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

const aideSection: Array<{ title: ReactNode; body: ReactNode }> = [
  {
    title: <Typography variant="h6">Comment créer un personnage ?</Typography>,
    body: (
      <ul>
        <li>
          <Typography>
            cliquez sur le menu Hero, vous serez dirigé vers la liste de vos
            héros créés
          </Typography>
        </li>
        <li>
          <Typography>cliquez sur le bouton Add </Typography>
        </li>
        <li>
          <Typography>un personnage est généré aléatoirement</Typography>
        </li>
        <li>
          <Typography>vous pouvez le personnaliser </Typography>
        </li>
        <li>
          <Typography>
            une fois satisfait du résultat cliquez sur le bouton Save en bas de
            page
          </Typography>
        </li>
        <li>
          <Typography>vous serez dirigé vers la liste de vos héros</Typography>
        </li>
        <li>
          <Typography>votre nouvel héro apparait dans la liste</Typography>
        </li>
      </ul>
    ),
  },
  {
    title: (
      <Typography variant="h6">Comment équiper un personnage ?</Typography>
    ),
    body: (
      <ul>
        <li>
          <Typography>
            cliquez sur le menu Hero, vous serez dirigé vers la liste de vos
            héros créés
          </Typography>
        </li>
        <li>
          <Typography>
            cliquez sur le héro que vous désirez équiper, la fiche du personnage
            apparaît
          </Typography>
        </li>
        <li>
          <Typography>
            Dans la liste du personnage, cliquez sur shopping
          </Typography>
        </li>
        <li>
          <Typography>vous serez dirigé vers le magasin</Typography>
        </li>
        <li>
          <Typography>
            Vous pouvez acheter et revendre de l'équipement
          </Typography>
        </li>
        <li>
          <Typography>
            Toute modification est sauvegardée immédiatement
          </Typography>
        </li>
      </ul>
    ),
  },
  {
    title: <Typography variant="h6">Comment lancer un duel ?</Typography>,
    body: (
      <ul>
        <li>
          <Typography>
            cliquez sur le menu Hero, vous serez dirigé vers la liste de vos
            héros
          </Typography>
        </li>
        <li>
          <Typography>
            Verifiez que les heros que vous souhaitez voir combattre possèdent
            l'icone : <BedroomBabyOutlined />, si ce n'est pas le cas :
          </Typography>
          <ul>
            <li>
              <Typography>
                cliquez sur le bouton Select de la fiche de personnage que vous
                souhaitez faire combattre
              </Typography>
            </li>
            <li>
              <Typography>une icone en forme de cheval apparait</Typography>
            </li>
            <li>
              <Typography>
                le bouton Select s'est transformer en un bouton Unselect pour
                retirer le hero des combattants
              </Typography>
            </li>
          </ul>
        </li>
        <li>
          <Typography>
            attention, seul les deux premiers heros selectionnés participent au
            combat
          </Typography>
          <ul>
            <li>
              <Typography>
                n'oubliez pas de ne selectionner que les deux que vous souhaitez
                voir combattre
              </Typography>
            </li>
            <li>
              <Typography>
                n'oubliez pas de leur donner un équipement, sinon vous risquez
                fort ne vous ennuyer !
              </Typography>
            </li>
          </ul>
        </li>
      </ul>
    ),
  },
  {
    title: (
      <Typography variant="h6">
        L'application ne fonctionne pas, comme faire ?
      </Typography>
    ),
    body: (
      <ol>
        <li>
          <Typography>
            Ouvrez le site web avec chrome, si le problème persiste passez à
            l'étape suivante.
          </Typography>
        </li>
        <li>
          <Typography>
            Rechargez l'application avec votre navigateur si le problème
            persiste passez à l'étape suivate
          </Typography>
        </li>
        <li>
          <Typography>
            cliquez sur le bouton ci-contre pour vider le cache et recharger
            l'application
          </Typography>
          <button
            disabled={!HeroRepository.all().length}
            onClick={() => {
              HeroRepository.reset();
              window.location.replace(window.location.href);
            }}
          >
            clear session
          </button>
        </li>
        <li>
          <Typography>
            Veuillez suivre la procédure officiel de chrome suivante :
            <a href="https://support.google.com/accounts/answer/32050?hl=fr&co=GENIE.Platform%3DDesktop">
              Vider le cache et supprimer les cookies
            </a>
          </Typography>
          <Typography variant="caption">
            Vous perdrez vos personnages mais vous pourrez jouer !
          </Typography>
        </li>
        <li>
          <Typography>
            Si toute ces manoeuvres n'ont pas suffit c'est que votre serviteur a
            fait une maladresse.
          </Typography>
          <Typography>
            <a href="mailto:axel.rolandgosselin@gmail.com">
              N'hésitez pas à me contacter afin que je puisse faire le
              nécessaire.
            </a>
          </Typography>
        </li>
      </ol>
    ),
  },
];
