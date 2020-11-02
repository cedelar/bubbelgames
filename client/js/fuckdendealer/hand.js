// Get WebSocket
var socket = io();

// Join a channel
socket.emit("join", "fuckdendealer");

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
        socket.on("fuckdendealerservermessage", (msg) => {
          console.log(msg);
          if (!msg.actief) {
            updatePreStartView();
          } else {
            updatePostStartView(msg);
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
    console.log(localStorage.getItem("login_name"));
    socket.emit("fuckdendealerclientmessage", {
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
      socket.emit("fuckdendealerclientmessage", {
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
      socket.emit("fuckdendealerclientmessage", {
        action: "reset",
      });
    }
  };
  parent.appendChild(child3);
};

updatePostStartView = function (msg) {
  const parent = document.getElementById("buttonwrapper");
  parent.innerHTML = "";

  //dealer
  if (msg.spelers[msg.dealerIndex] === localStorage.getItem("login_name")) {
    const child1 = document.createElement("button");
    child1.innerHTML = "Juist!";
    child1.setAttribute("class", "button");
    child1.onclick = () => {
      socket.emit("fuckdendealerclientmessage", {
        action: "processCard",
        data: {
          speler: localStorage.getItem("login_name"),
          result: "OK",
        },
      });
    };
    parent.appendChild(child1);

    const child3 = document.createElement("img");
    child3.setAttribute("src", msg.topcard.image);
    child3.setAttribute("class", "card");
    parent.appendChild(child3);

    const child2 = document.createElement("button");
    child2.innerHTML = "Fout!";
    child2.setAttribute("class", "button");
    child2.onclick = () => {
      socket.emit("fuckdendealerclientmessage", {
        action: "processCard",
        data: {
          speler: localStorage.getItem("login_name"),
          result: "NOK",
        },
      });
    };
    parent.appendChild(child2);
  } else {
    var ch = document.createElement("p");
    ch.innerHTML = "Wacht je beurt af";
    ch.setAttribute("class", "message");
    parent.appendChild(ch);
  }
};
