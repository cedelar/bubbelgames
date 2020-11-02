// Get WebSocket
var socket = io();

// Join a channel
socket.emit("join", "pigeon");
socket.on("pigeonservermessage", (msg) => {
  document.getElementById("name").innerHTML = msg.name + " wierp: ";
  let pv = document.getElementById("pigeonveld");
  //console.log(msg.pigeon);
  if (msg.pigeon) {
    pv.innerHTML = msg.pigeon + " is pigeon.";
  } else {
    pv.innerHTML = "Er is nog geen pigeon.";
  }
  let parent = document.getElementById("effectlist");
  parent.innerHTML = "";
  for (let i = 0; i < msg.output.length; i++) {
    let child = document.createElement("li");
    child.innerHTML = msg.output[i];
    parent.appendChild(child);
  }
  renderDice(msg.dice);
  //console.log("Output:" + msg.output);
});
