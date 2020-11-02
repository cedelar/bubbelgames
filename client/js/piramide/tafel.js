// Get WebSocket
var socket = io();

updateView = function (msg) {
  let parent = document.getElementById("piramideVeld");
  for (let i = 0; i < msg.tafel.length; i++) {
    let child = document.createElement("div");
    child.setAttribute("class", "cardrow");
    for (let j = 0; j < msg.tafel[i].length; j++) {
      let child1 = document.createElement("img");
      child1.setAttribute("class", "card");
      if (msg.tafel[i][j].isOpen) {
        child1.setAttribute("src", msg.tafel[i][j].card.image);
      } else {
        child1.setAttribute("src", msg.tafel[i][j].card.backimage);
      }
      child.style.position = "relative";
      child.style.zIndex = "-1";
      child.appendChild(child1);
      for (let z = 0; z < msg.tafel[i][j].stack.length; z++) {
        let child2 = document.createElement("img");
        child2.setAttribute("class", "card");
        console.log(msg.tafel[i][j].stack[z]);
        if (msg.tafel[i][j].stack[z].isOpen) {
          child2.setAttribute("src", msg.tafel[i][j].stack[z].card.image);
        } else {
          child2.setAttribute("src", msg.tafel[i][j].stack[z].card.backimage);
        }
        child2.style.position = "relative";
        child2.style.zIndex = "-1";
        child2.style.top = "50px";
        child2.style.right = "50px";
        child.appendChild(child2);
      }
    }
    parent.appendChild(child);
  }
};

// Join a channel
socket.emit("join", "piramide");
socket.on("piramideservermessage", (msg) => {
  if (!(msg.return === "NOK")) {
    console.log(msg);
    updateView(msg);
  }
});
