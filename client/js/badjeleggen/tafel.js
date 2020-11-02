// Get WebSocket
var socket = io();

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

resetView = function () {};

updateStatus = function (msg) {
  let tafelkaarten = msg.tafel;
  //console.log(msg);
  let parent = document.getElementById("cardwrapper");
  parent.innerHTML = "";
  for (let i = 0; i < tafelkaarten.length; i++) {
    let child = document.createElement("img");
    //child.setAttribute("src", tafelkaarten[i].image);
    child.setAttribute("src", tafelkaarten[i].backimage);
    child.setAttribute("class", "card");
    parent.appendChild(child);
    /*let child2 = document.createElement("h2");
    child2.innerHTML = i;
    parent.appendChild(child2);*/
  }

  parent = document.getElementById("lastcard");
  parent.innerHTML = "";
  let child = document.createElement("img");
  if (isEmpty(msg.kaart)) {
    //child.setAttribute("src", "../../images/cards/back.png");
  } else {
    child.setAttribute("src", msg.kaart[0].image);
  }
  child.setAttribute("class", "card");
  parent.appendChild(child);

  parent = document.getElementById("slokken");
  parent.innerHTML = "Totaal aantal slokken: " + msg.slokken;
};

// Join a channel
socket.emit("join", "badjeleggen");
socket.on("badjeleggenservermessage", (msg) => {
  if (!(msg.return === "NOK")) {
    switch (msg.source) {
      case "reset":
      case "status":
      case "kiesKaart":
      case "end":
        updateStatus(msg);
        break;
    }
  }
});
