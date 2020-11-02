const Spel = require("./spel").Spel;

class Dobbelsteen {
  constructor(aantalZijden = 6) {
    if (aantalZijden < 4) {
      throw "Te weinig zijden voor een dobbelsteen (" + aantalZijden + ")";
    }
    this._aantalZijden = aantalZijden;
    this._aantalOgen = 1;
  }

  get aantalZijden() {
    return this._aantalZijden;
  }

  get aantalOgen() {
    return this._aantalOgen;
  }

  gooi() {
    this._aantalOgen = Math.floor(Math.random() * this._aantalZijden + 1);
  }
}

class Dobbelspel {
  constructor(aantalDobbelstenen = 1, aantalZijden = 6) {
    this._dobbelstenen = [];
    for (let i = 0; i < aantalDobbelstenen; i++) {
      this._dobbelstenen.push(new Dobbelsteen(aantalZijden));
    }
    this._aantalZijden = aantalZijden;
  }

  setAantalDobbelstenen(aantal) {
    if (this._dobbelstenen.length != aantal) {
      this._dobbelstenen = [];
      for (let i = 0; i < aantal; i++) {
        this._dobbelstenen.push(new Dobbelsteen(this._aantalZijden));
      }
    }
  }

  dobbel() {
    this._dobbelstenen.forEach((ds) => ds.gooi());
  }

  dobbelEnkel(index) {
    this._dobbelstenen[index].gooi();
  }

  bekijk() {
    return this._dobbelstenen.map((ds) => ds.aantalOgen);
  }
}

test = function () {
  let ds = new Dobbelspel(3, 2);
  for (let i = 0; i < 10; i++) {
    ds.dobbel();
    console.log(ds.bekijk());
  }
};

module.exports = {
  Dobbelsteen: Dobbelsteen,
  Dobbelspel: Dobbelspel,
};
