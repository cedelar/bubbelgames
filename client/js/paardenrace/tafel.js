// Get WebSocket
var socket = io();

updateView = function (msg) {
  let rijen = [
    document.getElementById("rij1"),
    document.getElementById("rij2"),
    document.getElementById("rij3"),
    document.getElementById("rij4"),
    document.getElementById("rij5"),
  ];
  rijen.forEach((e) => (e.innerHTML = ""));

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < msg.zijkaarten.length + 2; j++) {
      let child = document.createElement("img");
      if (msg.aasIndex[i] === j) {
        console.log(msg.aasIndex[i]);
        child.setAttribute("src", msg.azen[i].image);
      }
      child.setAttribute("class", "acecard");
      rijen[i].appendChild(child);
    }
  }
  for (let i = 0; i < msg.zijkaarten.length + 2; i++) {
    let child = document.createElement("img");
    if (!(i === 0 || i === msg.zijkaarten.length + 1)) {
      if (msg.omgedraaid[i - 1]) {
        child.setAttribute("src", msg.zijkaarten[i - 1].image);
      } else {
        child.setAttribute("src", msg.zijkaarten[i - 1].backimage);
      }
    }
    child.setAttribute("class", "card");
    rijen[4].appendChild(child);
  }

  let vakken = [
    document.getElementById("vak1"),
    document.getElementById("vak2"),
    document.getElementById("vak3"),
    document.getElementById("vak4"),
  ];
  vakken.forEach((e) => (e.innerHTML = ""));
  let personen = [
    msg.spelers.filter((e) => e.keuze === "H"),
    msg.spelers.filter((e) => e.keuze === "K"),
    msg.spelers.filter((e) => e.keuze === "R"),
    msg.spelers.filter((e) => e.keuze === "S"),
  ];

  for (let i = 0; i < vakken.length; i++) {
    let parent = vakken[i];
    if (personen[i].length === 0) {
      let child = document.createElement("div");
      child.innerHTML = "Niemand";
      parent.appendChild(child);
    } else {
      for (let j = 0; j < personen[i].length; j++) {
        let child = document.createElement("div");
        child.innerHTML =
          personen[i][j].naam + " (" + personen[i][j].slokken + " slokken)";
        parent.appendChild(child);
      }
    }
  }

  let parent = document.getElementById("uitslag");
  parent.innerHTML = "";
  if (msg.end) {
    let win =
      msg.azen[
        msg.aasIndex.indexOf(
          msg.aasIndex.reduce(function (a, b) {
            return Math.max(a, b);
          })
        )
      ].soort;
    let child = document.createElement("h2");
    //console.log(win);
    switch (win) {
      case "H":
        child.innerHTML = "Harte wint!";
        break;
      case "K":
        child.innerHTML = "Klavere wint!";
        break;
      case "R":
        child.innerHTML = "Ruite wint!";
        break;
      case "S":
        child.innerHTML = "Schoppe wint!";
        break;
    }
    parent.appendChild(child);
  }

  parent = document.getElementById("kaart");
  parent.innerHTML = "";
  let child = document.createElement("img");
  child.setAttribute("src", msg.laatsteKaart.image);   
  child.setAttribute("class", "lastcard");
  parent.appendChild(child);
};

// Join a channel
socket.emit("join", "paardenrace");
socket.on("paardenraceservermessage", (msg) => {
  if (!(msg.return === "NOK")) {
    //console.log(msg);
    updateView(msg);
  }
});
