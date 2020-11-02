const Kaartspel = require("./kaartspel").Kaartspel;

class Piramide extends Kaartspel {
  constructor(rijen) {
    super();
    this._piramideRijen = rijen;
    this._reset();
    this._tafel[0][0].stack.push({
      card: this.draw(),
      isOpen: false,
    });
  }

  _statusOK(source = "status") {
    return {
      source: source,
      return: "OK",
      tafel: this._tafel,
      spelers: this._spelers,
      actief: this._actief,
      cardIndex: this._cardIndex,
      console: this._console,
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
    this._legPiramide();
    this._spelers = [];
    this._actief = false;
    this._cardIndex = [-1, -1];
    this._console = [];
    return this._statusOK("reset");
  }

  _legPiramide() {
    this._tafel = [...Array(this._piramideRijen)].map((e) => Array());
    for (let i = 0; i < this._tafel.length; i++) {
      for (let j = 0; j <= i; j++) {
        this._tafel[i].push({
          card: this.draw(),
          isOpen: false,
          stack: [],
        });
      }
    }
  }

  _addSpeler(speler) {
    if (!this._actief) {
      this._spelers.push({
        naam: speler,
        kaarten: [this.draw(), this.draw()],
        teBeslissen: [],
      });
      return this._statusOK("addSpeler");
    } else {
      return this._statusNOK("addSpeler");
    }
  }

  _start() {
    if (!this._actief && this._spelers.length > 1) {
      this._actief = true;
      this._cardIndex = [this._piramideRijen - 1, this._piramideRijen - 1];
      return this._statusOK("start");
    } else {
      return this._statusNOK("start");
    }
  }

  _legKaart(vanSpelerNaam, kaartID, aanSpelerNaam) {
    let vanSpeler = this._spelers.find((e) => e.naam === vanSpelerNaam);
    let aanSpeler = this._spelers.find((e) => e.naam === aanSpelerNaam);
    if (
      this._actief &&
      !(vanSpeler === undefined) &&
      !(aanSpeler === undefined) &&
      kaartID > -1 &&
      kaartID < 2
    ) {
      let kaart = vanSpeler.kaarten[kaartID];
      vanSpeler.kaarten[kaartID] = draw();
      aanSpeler.teBeslissen.push({
        card: kaart,
        uitdeler: vanSpelerNaam,
        index: this._tafel[this._cardIndex[0]][this._cardIndex[1]].stack.length,
      });
      this._tafel[this._cardIndex[0]][this._cardIndex[1]].stack.push({
        card: kaart,
        isOpen: false,
      });
      return this._statusOK("legKaart");
    } else {
      return this._statusNOK("legKaart");
    }
  }

  _beslis(spelerNaam, teBeslissenId, beslissing) {
    let speler = this._spelers.find((e) => e.naam === spelerNaam);
    if (this._actief && !(speler === undefined)) {
      let teBeslissenObject = this._spelers.teBeslissen.splice(
        teBeslissenId,
        1
      );
      if (beslissing === "draai") {
        this._tafel[this._cardIndex[0]][this._cardIndex[1]].stack[
          teBeslissenObject.index
        ].isOpen = true;
        let tafelkaart = this._tafel[this._cardIndex[0]][this._cardIndex[1]]
          .stack[teBeslissenObject.index].card;
        let accepteerkaart = teBeslissenObject.card;
        if (
          tafelkaart.soort === accepteerkaart.soort &&
          tafelkaart.getal === accepteerkaart.getal
        ) {
          this._console.unshift(
            tafelkaart.soort +
              "" +
              tafelkaart.getal +
              ") " +
              spelerNaam +
              " is correct: " +
              teBeslissenObject.uitdeler +
              " zuipt " +
              2 * (4 - this._cardIndex[0]) +
              " slokken!"
          );
        } else {
          this._console.unshift(
            tafelkaart.soort +
              "" +
              tafelkaart.getal +
              ") " +
              spelerNaam +
              " is fout en zuipt " +
              2 * (4 - this._cardIndex[0]) +
              " slokken!"
          );
        }
      } else {
        this._console.unshift(
          spelerNaam +
            " draait niet om en zuipt " +
            (4 - this._cardIndex[0]) +
            " slokken!"
        );
      }
      return this._statusOK("beslis");
    } else {
      return this._statusNOK("beslis");
    }
  }

  _volgendeKaart(spelerNaam) {
    let speler = this._spelers.find((e) => e.naam === spelerNaam);
    if (
      this._actief &&
      !(speler === undefined) &&
      !(this._cardIndex === [0, 0])
    ) {
      this._console = [];
      this._spelers.forEach((s) =>
        s.teBeslissen.forEach((b) => {
          this._console.unshift(
            spelerNaam +
              " draait niet om en zuipt " +
              (4 - this._cardIndex[0]) +
              " slokken!"
          );
        })
      );
      if (this._cardIndex[1] === 0) {
        this._cardIndex[0]--;
        this._cardIndex[1] = this._cardIndex[0];
      } else {
        this._cardIndex[1]--;
      }
      return this._statusOK("volgendeKaart");
    } else {
      return this._statusNOK("volgendeKaart");
    }
  }

  input(data) {
    switch (data.action) {
      case "reset":
        return this._reset();
      case "status":
        return this._statusOK();
      case "addSpeler":
        return this._addSpeler(data.speler);
      case "start":
        return this._start();
      case "legKaart":
        return this._legKaart(
          data.vanSpelerNaam,
          data.kaartID,
          data.aanSpelerNaam
        );
      case "beslis":
        return this._beslis(
          data.spelerNaam,
          data.teBeslissenId,
          data.beslissing
        );
      case "volgendeKaart":
        return this._volgendeKaart(data.spelerNaam);
      default:
        console.log("Piramide: inputerror");
        break;
    }
  }
}

module.exports = {
  Piramide: Piramide,
};
