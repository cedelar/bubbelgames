const Kaartspel = require("./kaartspel").Kaartspel;

class Paardenrace extends Kaartspel {
  constructor(len) {
    super();
    this._lengte = len;
    this._reset();
  }

  _statusOK(source = "status") {
    return {
      source: source,
      return: "OK",
      spelers: this._spelers,
      actief: this._actief,
      aasIndex: this._aasIndex,
      azen: this._azen,
      zijkaarten: this._zijKaarten,
      omgedraaid: this._omgedraaid,
      end: this._isEnd,
      laatsteKaart: this._laatsteKaart,
    };
  }

  _statusNOK(source = "status") {
    return {
      source: source,
      return: "NOK",
    };
  }

  _reset() {
    this.refill();
    this._spelers = [];
    this._actief = false;
    this._aasIndex = [0, 0, 0, 0];
    this._azen = [
      this.search("H", 1),
      this.search("K", 1),
      this.search("R", 1),
      this.search("S", 1),
    ];
    this._zijKaarten = [...Array(this._lengte)].map((e) => this.draw());
    this._omgedraaid = [...Array(this._lengte)].map((e) => false);
    this._isEnd = false;
    this._laatsteKaart = this.placeholder();
    return this._statusOK("reset");
  }

  _addSpeler(speler, soortKeuze, slokken) {
    console.log(this._spelers);
    if (
      !this._actief &&
      !this._spelers.map((e) => e.naam).includes(speler) &&
      !isNaN(slokken) &&
      slokken > 0
    ) {
      this._spelers.push({
        naam: speler,
        keuze: soortKeuze,
        slokken: slokken,
      });
      return this._statusOK("addSpeler");
    } else {
      return this._statusNOK("addSpeler");
    }
  }

  _start() {
    if (!this._actief && this._spelers.length > 0) {
      this._actief = true;
      return this._statusOK("start");
    } else {
      return this._statusNOK("start");
    }
  }

  _fixCheckpoint() {
    let laagsteTrue = this._omgedraaid.indexOf(true);
    if (
      laagsteTrue + 1 <
      this._aasIndex.reduce(function (a, b) {
        return Math.min(a, b);
      })
    ) {
      this._omgedraaid[laagsteTrue + 1] = true;
      let soort = this._zijKaarten[laagsteTrue + 1].soort;
      switch (soort) {
        case "H":
          if (this._aasIndex[0] > 0) {
            this._aasIndex[0] = 0;
          }
          break;
        case "K":
          if (this._aasIndex[1] > 0) {
            this._aasIndex[1] = 0;
          }
          break;
        case "R":
          if (this._aasIndex[2] > 0) {
            this._aasIndex[2] = 0;
          }
          break;
        case "S":
          if (this._aasIndex[3] > 0) {
            this._aasIndex[3] = 0;
          }
          break;
      }
    }
  }

  _next() {
    if (this._actief) {
      this._laatsteKaart = this.draw();
      let index = this._azen.map((e) => e.soort).indexOf(this._laatsteKaart.soort);
      this._aasIndex[index]++;
      this._fixCheckpoint();
      if (this._aasIndex.includes(this._lengte + 1)) {
        return this._end();
      }
      return this._statusOK("next");
    } else {
      return this._statusNOK("next");
    }
  }

  _end() {
    this._isEnd = true;
    return this._statusOK("end");
  }

  input(data) {
    switch (data.action) {
      case "status":
        return this._statusOK();
      case "reset":
        return this._reset();
      case "status":
        return this._statusOK();
      case "addSpeler":
        return this._addSpeler(
          data.data.speler,
          data.data.soortKeuze,
          data.data.slokken
        );
      case "start":
        return this._start();
      case "next":
        return this._next();
      default:
        console.log("Paardenrace: inputerror");
        break;
    }
  }
}

module.exports = {
  Paardenrace: Paardenrace,
};
