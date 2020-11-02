// Get WebSocket
var socket = io();

// Join a channel
socket.emit("join", "badjeleggen");

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
        const parent = document.getElementById("buttonwrapper");
        parent.innerHTML = "";
        const child1 = document.createElement("button");
        child1.setAttribute("class", "button");
        child1.innerHTML = "Trek kaart";
        child1.onclick = () => {
          socket.emit("badjeleggenclientmessage", {
            action: "kiesKaart",
            data: 0,
          });
        };
        parent.appendChild(child1);

        const child2 = document.createElement("button");
        child2.setAttribute("class", "button");
        child2.innerHTML = "Reset";
        child2.onclick = () => {
          socket.emit("badjeleggenclientmessage", {
            action: "reset",
          });
        };
        parent.appendChild(child2);
      } else {
        var ch = document.createElement("p");
        ch.innerHTML = "Log in om te spelen!";
        ch.setAttribute("class", "message");
        var parent = document.getElementById("buttonwrapper");
        parent.appendChild(ch);
      }
    });
  })
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
    document.getElementById("buttonwrapper").innerHTML = "Fetch Error :-S";
  });
