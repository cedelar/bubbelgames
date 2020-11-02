// Get WebSocket
var socket = io();

updateView = function (msg) {
  let tafel = msg.tafel;
  let bovenrij = [
    document.getElementById("boven1"),
    document.getElementById("boven2"),
    document.getElementById("boven3"),
    document.getElementById("boven4"),
  ];
  let onderrij = [
    document.getElementById("onder1"),
    document.getElementById("onder2"),
    document.getElementById("onder3"),
    document.getElementById("onder4"),
  ];
  bovenrij.forEach((e) => (e.innerHTML = ""));
  onderrij.forEach((e) => (e.innerHTML = ""));
  for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 4; j++) {
      let child = document.createElement("img");
      if (j < tafel[i].length) {
        if (tafel[i].length === 4) {
          child.setAttribute("src", tafel[i][j].backimage);
        } else {
          child.setAttribute("src", tafel[i][j].image);
        }
      }
      child.setAttribute("class", "card");
      if (i < 7) {
        bovenrij[j].appendChild(child);
      } else {
        onderrij[j].appendChild(child);
      }
    }
  }

  let spelers = msg.spelers;
  let parent = document.getElementById("spelers");
  parent.innerHTML = "";
  /*   let child = document.createElement("h2");
  child.innerHTML = "Spelers:";
  parent.appendChild(child); */
  for (let i = 0; i < spelers.length; i++) {
    let child = document.createElement("div");
    let text = spelers[i];
    if (msg.dealerIndex === i) {
      text += " (Dealer)";
    }
    if (msg.playingIndex === i) {
      text += " (Playing)";
    }
    child.innerHTML = text;
    child.setAttribute("class", "speler");
    parent.appendChild(child);
  }
};

// Join a channel
socket.emit("join", "fuckdendealer");
socket.on("fuckdendealerservermessage", (msg) => {
  if (!(msg.return === "NOK")) {
    if (!(msg.source === "seeTopCard")) {
      //console.log(msg);
      updateView(msg);
    }
  }
});
