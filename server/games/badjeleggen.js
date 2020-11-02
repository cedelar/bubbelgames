const Kaartspel = require("./kaartspel").Kaartspel;

class Badjeleggen extends Kaartspel {
  constructor() {
    super();
    this._reset();
  }

  _reset() {
    this.refill();
    this._tafelKaarten = [];
    this._laatsteKaart = {};
    this._drawNaarTafel(7);
    this._aantalSlokken = 0;
    return {
      source: "reset",
      return: "OK",
      kaart: this._laatsteKaart,
      slokken: this._aantalSlokken,
      tafel: this._tafelKaarten,
    };
  }

  getAantalKaarten() {
    return this._tafelKaarten.length;
  }

  _drawNaarTafel(aantal) {
    if (!this.isEmpty()) {
      for (let i = 0; i < aantal; i++) {
        this._tafelKaarten.push(this.draw());
      }
    }
  }

  _legBij(aantal) {
    console.log("Aantal: " + aantal);
    switch (aantal) {
      case 11:
        this._drawNaarTafel(1);
        this._aantalSlokken += 1;
        break;
      case 12:
        this._drawNaarTafel(2);
        this._aantalSlokken += 2;
        break;
      case 13:
        this._drawNaarTafel(3);
        this._aantalSlokken += 3;
        break;
      case 1:
        this._drawNaarTafel(4);
        this._aantalSlokken += 4;
        break;
      default:
        break;
    }
  }

  _status() {
    return {
      source: "status",
      return: "OK",
      kaart: this._laatsteKaart,
      slokken: this._aantalSlokken,
      tafel: this._tafelKaarten,
    };
  }

  _end() {
    return {
      source: "end",
      return: "OK",
      kaart: this._laatsteKaart,
      slokken: this._aantalSlokken,
      tafel: this._tafelKaarten,
    };
  }

  _kiesKaart(index) {
    if (index >= 0 && index < this._tafelKaarten.length) {
      this._laatsteKaart = this._tafelKaarten.splice(index, 1);
      //console.log(this._laatsteKaart[0]);
      this._legBij(this._laatsteKaart[0].getal);
      if (this._tafelKaarten.length === 0) {
        return this._end();
      }
      return {
        source: "kiesKaart",
        return: "OK",
        kaart: this._laatsteKaart,
        slokken: this._aantalSlokken,
        tafel: this._tafelKaarten,
      };
    } else {
      return { source: "kiesKaart", return: "NOK" };
    }
  }

  printState() {
    let kaart;
    //console.log("Badjeleggen: ");
    let tafels = "Tafel: ";
    for (kaart in this._tafelKaarten) {
      tafels +=
        this._tafelKaarten[kaart].soort +
        this._tafelKaarten[kaart].getal +
        ", ";
    }
    console.log("Slokken: " + this._aantalSlokken);
    console.log(tafels);
  }

  input(data) {
    switch (data.action) {
      case "reset":
        return this._reset();
      case "status":
        return this._status();
      case "kiesKaart":
        return this._kiesKaart(data.data);
    }
  }
}

module.exports = {
  Badjeleggen: Badjeleggen,
};
