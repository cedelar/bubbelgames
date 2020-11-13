const Dobbelspel = require("./dobbelspel").Dobbelspel;

const geschSize = 10;

intArrayToString = function (arr) {
  return arr.reduce((prev, curr) => prev + " " + curr, "");
};

class PigeonSpel extends Dobbelspel {
  constructor() {
    super(2);
    this._geschiedenis = [];
    //this.setAantalDobbelstenen(2);
    this._pigeon = "";
  }

  pigeonGesmeten() {
    const stenen = this.bekijk().sort((a, b) => a - b);
    if (stenen[0] === 1 && stenen[1] === 2) {
      return true;
    }
    return false;
  }

  dubbelGesmeten() {
    const stenen = this.bekijk();
    if (stenen[0] === stenen[1]) {
      return stenen[0];
    }
    return false;
  }

  eenenGesmeten() {
    const enen = this.bekijk().filter((g) => g === 1);
    return enen.length;
  }

  speel(spelerNaam) {
    this.dobbel();
    let r = this._controle(spelerNaam);
    this._geschiedenis.unshift(spelerNaam);
    if(this._geschiedenis.length > geschSize){
      this._geschiedenis.pop();
    }
    return {
      name: spelerNaam,
      dice: this.bekijk(),
      output: r,
      pigeon: this._pigeon,
      geschiedenis: this._geschiedenis,
    };
  }

  _controle(spelerNaam) {
    let r = [];
    let s = "";
    if (this.eenenGesmeten() && this._pigeon) {
      s = this._pigeon + " zuipt " + this.eenenGesmeten() + " slokken!";
      r.push(s);
      console.log(s);
    }
    if (this.pigeonGesmeten()) {
      this._pigeon = spelerNaam;
      s = this._pigeon + " is nieuwe pigeon!";
      r.push(s);
      console.log(s);
    }
    if (this.dubbelGesmeten()) {
      s = spelerNaam + " mag " + this.dubbelGesmeten() + " slokken uitdelen!";
      r.push(s);
      console.log(s);
    }
    return r;
  }
}

test = function () {
  const spel = new PigeonSpel(4);
  for (let i = 0; i < 100; i++) {
    spel.speel();
    console.log(intArrayToString(spel.bekijk()));
    console.log("------------------");
  }
};

module.exports = {
  PigeonSpel: PigeonSpel,
};
module.exports.test = test;
