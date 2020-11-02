checkNDice = function (input) {
  if (isNaN(input)) {
    return 2;
  }
  if (input < minDice) {
    return minDice;
  }
  if (input > maxDice) {
    return maxDice;
  }
  return input;
};

// Get WebSocket
var socket = io();

// Join a channel
socket.emit("join", "dobbelspel");

var username = localStorage.getItem("login_name");
var token = localStorage.getItem("login_key");

fetch("./../../auth/username/" + username + "/token/" + token)
  .then(function (response) {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      document.getElementById("buttonwrapper").innerHTML =
        "Looks like there was a problem. Status Code: " + response.status;
      return;
    }

    response.json().then(function (data) {
      console.log(data);
      if (data.status === "OK") {
        //insert code
        document
          .getElementById("dobbelButton")
          .addEventListener("click", () => {
            let name = localStorage.getItem("login_name");
            let nDice = checkNDice(document.getElementById("nDice").value);
            socket.emit("dobbelclientmessage", { name: name, nDice: nDice });
          });
      } else {
        document.getElementById("buttonwrapper").innerHTML = "";
        var ch = document.createElement("p");
        ch.innerHTML = "Log in om te spelen!";
        ch.setAttribute("class", "message");
        var parent = document.getElementById("buttonwrapper");
        parent.appendChild(ch);
        document.getElementById("middle").innerHTML = "";
      }
    });
  })
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
    document.getElementById("buttonwrapper").innerHTML = "Fetch Error :-S";
  });
