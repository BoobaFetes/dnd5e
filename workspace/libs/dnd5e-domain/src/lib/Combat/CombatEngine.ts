import { CombatTarget } from './CombatTarget';

export class CombatEngine {
  public targets: CombatTarget[] = [];

  public addTargets(targets: CombatTarget[]) {
    this.targets = [...this.targets, ...targets];
  }

  public removeTarget(target: CombatTarget) {
    const index = this.targets.findIndex(
      (ct) => ct.character.index === target.character.index
    );
    if (index >= 0) {
      this.targets.splice(index, 1);
    }
  }

  public clearTargets() {
    this.targets = [];
  }

  public setOrder() {
    // Détermine l'ordre de combat en lançant l'initiative pour chaque personnage
    const initiativeRolls: Array<{ target: CombatTarget; value: number }> = [];

    for (const target of this.targets) {
      const initiativeRoll = Math.floor(Math.random() * 20) + 1; // Jet de d20 pour l'initiative
      initiativeRolls.push({
        target,
        value: initiativeRoll + target.character.abilities.dex.modifier,
      });
    }

    // Trier les personnages par ordre décroissant des jets d'initiative
    initiativeRolls.sort((a, b) => b.value - a.value);

    // Retourner la liste des personnages dans l'ordre de combat
    this.targets = initiativeRolls.map((item) => item.target);
  }
}
