// Get WebSocket
var socket = io();

// Join a channel
socket.emit("join", "dobbelspel");
socket.on("dobbelservermessage", (msg) => {
  document.getElementById("name").innerHTML = msg.name + " wierp: ";
  renderDice(msg.dice);
});
