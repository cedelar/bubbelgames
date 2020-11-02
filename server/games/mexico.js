const Dobbelspel = require("./dobbelspel").Dobbelspel;

class MexicoSpel extends Dobbelspel {
  constructor() {
    super(2);
    this._reset();
  }

  _reset() {
    this._spelers = [];
    this._oldSpelers = [];
    this._playing = false;
    this._laagst = { speler: [], score: 601 };
    this._aantalMexico = 0;
    this._currentSpelerDobbels = 0;
    this._maxAantalDobbels = 3;
    this._eersteSpeler = true;
    this._endflag = false;
    return { source: "reset", return: "OK" };
  }

  _replay() {
    this._spelers = Array.from(this._oldSpelers);
    this._playing = true;
    this._laagst = { speler: [], score: 601 };
    this._aantalMexico = 0;
    this._currentSpelerDobbels = 0;
    this._maxAantalDobbels = 3;
    this._eersteSpeler = true;
    this._endflag = false;
    return { source: "replay", return: "OK", spelers: this._spelers };
  }

  _addSpeler(naam) {
    if (!this._playing && !this._spelers.includes(naam)) {
      this._spelers.push(naam);
      return { source: "addSpeler", return: "OK", spelers: this._spelers };
    }
    return { source: "addSpeler", return: "NOK" };
  }

  _start() {
    if (this._spelers.length > 1 && !this._playing) {
      this._playing = true;
      this._oldSpelers = Array.from(this._spelers);
      return { source: "start", return: "OK" };
    }
    return { source: "start", return: "NOK" };
  }

  _mexicoGesmeten() {
    const stenen = this.bekijk().sort((a, b) => a - b);
    if (stenen[0] === 1 && stenen[1] === 2) {
      return true;
    }
    return false;
  }

  _dubbelGesmeten() {
    const stenen = this.bekijk();
    if (stenen[0] === stenen[1]) {
      return stenen[0];
    }
    return false;
  }

  _gesmetenScore() {
    if (this._mexicoGesmeten()) {
      return "Mexico!";
    } else if (this._dubbelGesmeten()) {
      return this._dubbelGesmeten() * 100;
    } else {
      const stenen = this.bekijk().sort((a, b) => a - b);
      return stenen[0] + stenen[1] * 10;
    }
  }

  _update(spelerNaam) {
    let score = this._gesmetenScore();
    if (score === "Mexico!") {
      this._aantalMexico++;
    } else if (score === this._laagst.score) {
      this._laagst.speler.push(spelerNaam);
    } else if (score < this._laagst.score) {
      this._laagst.speler = [spelerNaam];
      this._laagst.score = score;
    }
  }

  _nextSpeler(spelerNaam) {
    if (
      this._playing &&
      spelerNaam === this._spelers[0] &&
      this._currentSpelerDobbels > 0
    ) {
      this._update(spelerNaam);
      this._spelers.shift();
      if (this._eersteSpeler) {
        this._maxAantalDobbels = this._currentSpelerDobbels;
        this._eersteSpeler = false;
      }
      if (this._spelers.length === 0) {
        return this._end();
      }
      this._currentSpelerDobbels = 0;
      return {
        source: "nextSpeler",
        return: "OK",
        spelers: this._spelers,
        laagst: this._laagst,
        aantalMexicos: this._aantalMexico,
        dice: this.bekijk(),
      };
    } else {
      return { source: "nextSpeler", return: "NOK" };
    }
  }

  _speel(spelerNaam) {
    if (
      this._spelers.includes(spelerNaam) &&
      this._playing &&
      spelerNaam === this._spelers[0] &&
      this._currentSpelerDobbels < this._maxAantalDobbels
    ) {
      this.dobbel();
      this._currentSpelerDobbels++;
      if (this._currentSpelerDobbels === this._maxAantalDobbels) {
        return this._nextSpeler(spelerNaam);
      } else {
        return {
          source: "dobbel",
          return: "OK",
          name: spelerNaam,
          dice: this.bekijk(),
          score: this._gesmetenScore(),
          spelers: this._spelers,
        };
      }
    } else {
      return { source: "dobbel", return: "NOK" };
    }
  }

  _end() {
    if (this._laagst.speler.length < 2) {
      this._endflag = true;
      return {
        source: "end",
        return: "OK",
        laagst: this._laagst,
        aantalMexicos: this._aantalMexico,
        spelers: this._spelers,
      };
    } else {
      this._spelers = this._laagst.speler;
      this._laagst = { speler: [], score: 601 };
      this._currentSpelerDobbels = 0;
      this._maxAantalDobbels = 1;
      return {
        source: "nextSpeler",
        return: "OK",
        spelers: this._spelers,
        aantalMexicos: this._aantalMexico,
      };
    }
  }

  _status() {
    return {
      source: "status",
      return: "OK",
      spelers: this._spelers,
      actief: this._playing,
      end: this._endflag,
    };
  }

  printState() {
    console.log("MexicoSpel: ");
    console.log("Spelers: " + this._spelers);
    console.log("Oude spelers: " + this._oldSpelers);
    console.log("Playing?: " + this._playing);
    if (this._playing) {
      console.log("Aantal maal gedobbeld: " + this._currentSpelerDobbels);
      console.log(
        "Laagste score: " +
          this._laagst.speler +
          " met " +
          this._laagst.score +
          "ptn."
      );
      console.log("Aantal Mexico's: " + this._aantalMexico);
    }
    console.log("----------");
  }

  input(data) {
    switch (data.action) {
      case "reset":
        return this._reset();
      case "addSpeler":
        return this._addSpeler(data.data);
      case "start":
        return this._start();
      case "dobbel":
        return this._speel(data.data);
      case "nextSpeler":
        return this._nextSpeler(data.data);
      case "status":
        return this._status();
      case "replay":
        return this._replay();
      default:
        return { source: "error", return: "NOK" };
    }
  }
}

module.exports = {
  MexicoSpel: MexicoSpel,
};
