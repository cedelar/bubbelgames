class Kaartspel {
  constructor(
    soorten = ["H", "K", "R", "S"],
    getallen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  ) {
    this._soorten = soorten;
    this._getallen = getallen;
    this.refill();
  }

  refill() {
    this._fill(this._soorten, this._getallen);
    this._shuffle();
  }

  _fill(soorten, getallen) {
    this._kaarten = [];
    let srt;
    let gtl;
    for (srt in soorten) {
      for (gtl in getallen) {
        this._kaarten.push({
          soort: soorten[srt],
          getal: getallen[gtl],
          image:
            "../../images/cards/" + soorten[srt] + "/" + getallen[gtl] + ".png",
          backimage: "../../images/cards/back.png",
        });
      }
    }
  }

  _shuffle() {
    for (let i = this._kaarten.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._kaarten[i], this._kaarten[j]] = [
        this._kaarten[j],
        this._kaarten[i],
      ];
    }
  }

  draw() {
    if (this._kaarten.length > 0) {
      return this._kaarten.shift();
    }
  }

  peek() {
    if (this._kaarten.length > 0) {
      return this._kaarten[0];
    }
  }

  search(soort, getal) {
    let kaart;
    for (let i = 0; i < this._kaarten.length; i++) {
      if (
        soort === this._kaarten[i].soort &&
        getal === this._kaarten[i].getal
      ) {
        kaart = this._kaarten.splice(i, 1)[0];
      }
    }
    return kaart;
  }

  isEmpty() {
    if (this._kaarten.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  print() {
    let kaart;
    console.log("Kaartspel: ");
    for (kaart in this._kaarten) {
      console.log(this._kaarten[kaart].soort + this._kaarten[kaart].getal);
    }
  }
}

module.exports = {
  Kaartspel: Kaartspel,
};
