export class Dice {
  count: number;
  faces: number;
  constructor(value: string) {
    const diceElement = value.split('d').map((i) => Number(i));
    this.count = diceElement[0] || 1;
    this.faces = diceElement[1];
  }

  public roll() {
    let result = 0;
    for (let i = this.count; i > 0; i--) {
      result += this.rollOnce();
    }
    return result;
  }

  public rollOnce() {
    return Math.floor(Math.random() * this.faces) + 1;
  }
}
