getDummyNaam = function (index) {
  return "Speler_" + index;
};

class Speler {
  constructor(naam) {
    this._naam = naam;
  }

  get naam() {
    return this._naam;
  }
}

class Spel {
  constructor(aantalSpelers) {
    this._spelers = [];
    for (let i = 0; i < aantalSpelers; i++) {
      this._spelers.push(new Speler(getDummyNaam(i)));
    }
    //this._spelers = new Array(aantalSpelers).fill(new Speler(""));
    this._scores = new Array(aantalSpelers).fill(0);
    this._nowPlaying = 0;
  }

  get nowPlaying() {
    return this._nowPlaying;
  }

  get nowPlayingSpeler() {
    return this._spelers[this._nowPlaying];
  }

  addScore(punten, spelerIndex = this._nowPlaying) {
    this._scores[spelerIndex] += punten;
  }

  get score() {
    return this._scores[this._nowPlaying];
  }

  get scores() {
    return this._scores;
  }

  next() {
    if (this._nowPlaying >= this._spelers.length - 1) {
      this._nowPlaying = 0;
    } else {
      this._nowPlaying++;
    }
  }
}

test = function () {
  let sp = new Spel(5);
  for (let i = 0; i < 10; i++) {
    sp.addScore(50);
    console.log(
      "NowPlaying: " + sp.nowPlayingSpeler.naam + " (" + sp.score + ")"
    );
    console.log("Punten: " + sp.scores);
    sp.next();
  }
};

module.exports = {
  Spel: Spel,
  Speler: Speler,
};
