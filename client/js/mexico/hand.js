// Get WebSocket
var socket = io();

// Join a channel
socket.emit("join", "mexico");

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
        socket.on("mexicoservermessage", (msg) => {
          if (msg.source === "status") {
            if (!msg.actief) {
              updatePreStartView();
            } else {
              if (msg.end) {
                updateEndView();
              } else {
                updatePostStartView();
              }
            }
          }
          if (msg.source === "start" && msg.return === "OK") {
            updatePostStartView();
          }
          if (msg.source === "reset" && msg.return === "OK") {
            updatePreStartView();
          }
          if (msg.source === "end" && msg.return === "OK") {
            updateEndView();
          }
          if (msg.source === "replay" && msg.return === "OK") {
            updatePostStartView();
          }
        });
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

updatePreStartView = function () {
  const parent = document.getElementById("buttonwrapper");
  parent.innerHTML = "";

  const child1 = document.createElement("button");
  child1.innerHTML = "Join spel";
  child1.setAttribute("class", "button");
  child1.onclick = () => {
    socket.emit("mexicoclientmessage", {
      action: "addSpeler",
      data: localStorage.getItem("login_name"),
    });
  };
  parent.appendChild(child1);

  const child2 = document.createElement("button");
  child2.innerHTML = "Start spel";
  child2.setAttribute("class", "button");
  child2.onclick = () => {
    if (confirm("Spel starten?")) {
      socket.emit("mexicoclientmessage", {
        action: "start",
      });
      location.reload();
    }
  };
  parent.appendChild(child2);

  const child3 = document.createElement("button");
  child3.innerHTML = "Reset spel";
  child3.setAttribute("class", "button");
  child3.onclick = () => {
    if (confirm("Wil je echt resetten?")) {
      socket.emit("mexicoclientmessage", {
        action: "reset",
      });
      location.reload();
    }
  };
  parent.appendChild(child3);
};

updatePostStartView = function () {
  const parent = document.getElementById("buttonwrapper");
  parent.innerHTML = "";

  const child1 = document.createElement("button");
  child1.innerHTML = "Dobbel";
  child1.setAttribute("class", "button");
  child1.onclick = () => {
    socket.emit("mexicoclientmessage", {
      action: "dobbel",
      data: localStorage.getItem("login_name"),
    });
    location.reload();
  };
  parent.appendChild(child1);
  const child2 = document.createElement("button");
  child2.innerHTML = "Einde beurt";
  child2.setAttribute("class", "button");
  child2.onclick = () => {
    socket.emit("mexicoclientmessage", {
      action: "nextSpeler",
      data: localStorage.getItem("login_name"),
    });
    location.reload();
  };
  parent.appendChild(child2);
  const child3 = document.createElement("button");
  child3.innerHTML = "Reset spel";
  child3.setAttribute("class", "button");
  child3.onclick = () => {
    if (confirm("Wil je echt resetten?")) {
      socket.emit("mexicoclientmessage", {
        action: "reset",
      });
      location.reload();
    }
  };
  parent.appendChild(child3);
};

updateEndView = function () {
  updatePostStartView();
  const parent = document.getElementById("buttonwrapper");

  const child1 = document.createElement("button");
  child1.innerHTML = "Herbegin spel";
  child1.setAttribute("class", "button");
  child1.onclick = () => {
    if (confirm("Wil je echt herstarten?")) {
      socket.emit("mexicoclientmessage", {
        action: "replay",
      });
      location.reload();
    }
  };
  parent.appendChild(child1);
};
