const Kaartspel = require("./kaartspel").Kaartspel;

class Fuckdendealer extends Kaartspel {
  constructor() {
    super();
    this._reset();
    //this._test();
  }

  _test() {
    for (let i = 0; i < 20; i++) {
      this._placeOnTable(this.draw());
    }
    this._addSpeler("Speler1");
    this._addSpeler("Speler2");
    this._addSpeler("Speler3");
    this._addSpeler("Speler4");
    this._addSpeler("Speler5");

    this._playingIndex = 1;
    this._dealerIndex = 3;
  }

  _reset() {
    this.refill();
    this._tafel = [...Array(13)].map((e) => Array());
    this._spelers = [];
    this._actief = false;
    this._dealerIndex = -1;
    this._playingIndex = -1;
    this._dealerCount = 0;
    return this._statusOK("reset");
  }

  _statusOK(source = "status") {
    return {
      source: source,
      return: "OK",
      tafel: this._tafel,
      spelers: this._spelers,
      actief: this._actief,
      dealerIndex: this._dealerIndex,
      playingIndex: this._playingIndex,
      topcard: this.peek(),
    };
  }

  _statusNOK(source = "status") {
    return {
      source: source,
      return: "NOK",
    };
  }

  _placeOnTable(card) {
    if (card.getal === 1) {
      this._tafel[12].push(card);
    } else {
      this._tafel[card.getal - 2].push(card);
    }
  }

  _addSpeler(speler) {
    if (!this._actief && !this._spelers.includes(speler)) {
      this._spelers.push(speler);
      return this._statusOK("addSpeler");
    } else {
      return this._statusNOK("addSpeler");
    }
  }

  _start() {
    if (!this._actief && this._spelers.length > 1 && !this.isEmpty()) {
      this._actief = true;
      this._dealerIndex = 0;
      this._playingIndex = 1;
      return this._statusOK("start");
    } else {
      return this._statusNOK("start");
    }
  }

  _seeTopCard(speler) {
    if (this._actief && this._spelers[this._dealerIndex] === speler) {
      return { source: "seeTopCard", return: "OK", card: this._peek() };
    } else {
      return this._statusNOK("seeTopCard");
    }
  }

  _processCard(speler, result) {
    if (this._actief && this._spelers[this._dealerIndex] === speler) {
      if (!this.isEmpty()) {
        this._placeOnTable(this.draw());
      }
      if (result === "OK") {
        this._dealerCount = 0;
      } else {
        this._dealerCount++;
      }
      if (this._dealerCount === 3) {
        this._dealerCount = 0;
        console.log(this._dealerIndex + 1 + " / " + this._spelers.length);
        if (this._dealerIndex + 1 === this._spelers.length) {
          this._dealerIndex = 0;
        } else {
          this._dealerIndex++;
        }
      }
      if (this._playingIndex + 1 === this._spelers.length) {
        this._playingIndex = 0;
      } else {
        this._playingIndex++;
      }
      if (this._playingIndex === this._dealerIndex) {
        if (this._playingIndex + 1 === this._spelers.length) {
          this._playingIndex = 0;
        } else {
          this._playingIndex++;
        }
      }
      if (this.isEmpty()) {
        this._actief = false;
        return this._statusOK("end");
      }
      return this._statusOK("processCard");
    } else {
      return this._statusNOK("processCard");
    }
  }

  printStatus = function () {
    console.log("dealerIndex: " + this._dealerIndex);
    console.log("playingIndex: " + this._playingIndex);
    console.log("dealerCount: " + this._dealerCount);
  };

  input(data) {
    console.log(data);
    switch (data.action) {
      case "reset":
        return this._reset();
      case "status":
        return this._statusOK();
      case "addSpeler":
        return this._addSpeler(data.data);
      case "start":
        return this._start();
      /*case "seeTopCard":
        return this._seeTopCard(data.speler);*/
      case "processCard":
        return this._processCard(data.data.speler, data.data.result);
    }
  }
}

module.exports = {
  Fuckdendealer: Fuckdendealer,
};
