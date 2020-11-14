// Get WebSocket
var socket = io();

// Join a channel
socket.emit("join", "mexico");

updateSpelerLijst = function (spelers) {
  let parent = document.getElementById("spelerwrapper");
  parent.innerHTML = "";
  if (spelers.length === 0) {
    let child = document.createElement("p");
    child.innerHTML = "Geen spelers";
    parent.appendChild(child);
  } else {
    for (let i = 0; i < spelers.length; i++) {
      let child = document.createElement("p");
      child.innerHTML = spelers[i];
      parent.appendChild(child);
    }
  }
};

updateSpelInfoVeld = function (text) {
  let parent = document.getElementById("info");
  parent.innerHTML = "";
  let child = document.createElement("p");
  child.innerHTML = text[0];
  parent.appendChild(child);
  let child2 = document.createElement("p");
  child2.innerHTML = text[1];
  parent.appendChild(child2);
};

updateScorebord = function (score, nMexico, nWorpen) {
  let parent = document.getElementById("scorewrapper");
  parent.innerHTML = "";
  let child1 = document.createElement("p");
  child1.innerHTML = "Aantal Mexico's: " + nMexico;
  parent.appendChild(child1);

  let child2 = document.createElement("p");
  let s = "";
  if (score.score > 600) {
    s = "Laagste worp: - ";
  } else {
    s = "Laagste worp: ";
    if (score.speler.length > 1) {
      for (let i = 0; i < score.speler.length; i++) {
        if (i < score.speler.length - 1) {
          s += score.speler[i] + ",  ";
        } else {
          s += score.speler[i];
        }
      }
    } else {
      s += score.speler[0];
    }

    s += " met " + score.score;
    child2.innerHTML = s;
  }
  child2.innerHTML = s;
  parent.appendChild(child2);

  let child3 = document.createElement("p");
  child3.innerHTML = "Aantal worpen: " + nWorpen;
  parent.appendChild(child3);
  
};

resetView = function () {
  updateSpelerLijst([]);
  updateSpelInfoVeld(["Start met spelers aanmelden!", ""]);
  updateScorebord({ speler: [], score: 601 }, 0, 0);
};

berekenAantalSlokken = function (nMexico) {
  if (!mexicoExponentieel) {
    return mexicoStartSlokken * (nMexico + 1);
  } else {
    return Math.pow(mexicoStartSlokken, nMexico + 1);
  }
};

drieeenGesmeten = function (dice) {
  const stenen = dice.sort((a, b) => a - b);
  if (stenen[0] === 1  && stenen[1] === 3) {
    return true;
  }
  return false;
};

drietweeGesmeten = function (dice) {
  const stenen = dice.sort((a, b) => a - b);
  if ( stenen[0] === 2 && stenen[1] === 3) {
    return true;
  }
  return false;
};

slokkenstring = function (dice) {
  if (this.drieeenGesmeten(dice)) {
    return "31 geworpen, 1 slok!";
  } else if (this.drietweeGesmeten(dice)) {
    return "32 geworpen, 1 slok!";
  } else{
    return "";
  }
};

socket.on("mexicoservermessage", (msg) => {
  console.log(msg);
  if (!(msg.return === "NOK")) {
    switch (msg.source) {
      case "reset":
        resetView();
        break;
      case "addSpeler":
        updateSpelInfoVeld([
          msg.spelers[msg.spelers.length - 1] + " joint het spel!",
          "",
        ]);
        updateSpelerLijst(msg.spelers);
        break;
      case "start":
        updateSpelInfoVeld(["Begin met gooien!", ""]);
        break;
      case "replay":
        resetView();
        updateSpelerLijst(msg.spelers);
        updateSpelInfoVeld(["Begin met gooien!", ""]);
        break;
      case "dobbel":
        updateSpelInfoVeld([
          msg.name + " wierp " + msg.score,
          slokkenstring(msg.dice),
        ]);
        renderDice(msg.dice);
        break;
      case "nextSpeler":
        updateSpelInfoVeld([
          msg.spelers[0] + " mag gooien",
          slokkenstring(msg.dice),
        ]);
        updateSpelerLijst(msg.spelers);
        updateScorebord(msg.laagst, msg.aantalMexicos, msg.worpen);
        renderDice(msg.dice);
        break;
      case "status":
        if (msg.actief) {
          updateSpelInfoVeld(["Ga verder met het spel", ""]);
        } else {
          updateSpelInfoVeld(["Ga verder met aanmelden", ""]);
        }
        updateSpelerLijst(msg.spelers);
        break;
      case "end":
        if (msg.laagst.score > 600) {
          updateSpelInfoVeld([
            "Einde spel: Niemand zuipt (Iedereen mexico)",
            "",
          ]);
        } else {
          updateSpelInfoVeld([
            "Einde spel: " +
              msg.laagst.speler[0] +
              " zuipt " +
              berekenAantalSlokken(msg.aantalMexicos) +
              " slokken!",
            "",
          ]);
        }

        updateScorebord(msg.laagst, msg.aantalMexicos, msg.worpen);
        updateSpelerLijst([]);
    }
  }
});

resetView();
