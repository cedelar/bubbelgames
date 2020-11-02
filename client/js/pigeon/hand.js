// Get WebSocket
var socket = io();

// Join a channel
socket.emit("join", "pigeon");

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
            socket.emit("pigeonclientmessage", { name: name });
          });
      } else {
        var parent = document.getElementById("buttonwrapper");
        parent.innerHTML = "";
        var ch = document.createElement("p");
        ch.innerHTML = "Log in om te spelen!";
        ch.setAttribute("class", "message");
        parent.appendChild(ch);
      }
    });
  })
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
    document.getElementById("buttonwrapper").innerHTML = "Fetch Error :-S";
  });
