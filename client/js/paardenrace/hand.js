// Get WebSocket
var socket = io();

// Join a channel
socket.emit("join", "paardenrace");

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
        socket.on("paardenraceservermessage", (msg) => {
          console.log(msg);
          if (msg.return === "OK") {
            if (!msg.actief) {
              updatePreStartView();
            } else {
              updatePostStartView(msg.end);
            }
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
  const div1 = document.createElement("div");

  var child = document.createElement("input");
  child.setAttribute("type", "text");
  child.setAttribute("id", "amount");
  div1.appendChild(child);
  parent.appendChild(div1);

  const div2 = document.createElement("div");

  child = document.createElement("button");
  child.innerHTML = "Join Harten";
  child.setAttribute("class", "button");
  child.onclick = () => {
    console.log(localStorage.getItem("login_name"));
    console.log(document.getElementById("amount").value);
    socket.emit("paardenraceclientmessage", {
      action: "addSpeler",
      data: {
        speler: localStorage.getItem("login_name"),
        soortKeuze: "H",
        slokken: document.getElementById("amount").value,
      },
    });
  };
  div2.appendChild(child);

  child = document.createElement("button");
  child.innerHTML = "Join Klaveren";
  child.setAttribute("class", "button");
  child.onclick = () => {
    console.log(localStorage.getItem("login_name"));
    socket.emit("paardenraceclientmessage", {
      action: "addSpeler",
      data: {
        speler: localStorage.getItem("login_name"),
        soortKeuze: "K",
        slokken: document.getElementById("amount").value,
      },
    });
  };
  div2.appendChild(child);

  child = document.createElement("button");
  child.innerHTML = "Join Ruiten";
  child.setAttribute("class", "button");
  child.onclick = () => {
    console.log(localStorage.getItem("login_name"));
    socket.emit("paardenraceclientmessage", {
      action: "addSpeler",
      data: {
        speler: localStorage.getItem("login_name"),
        soortKeuze: "R",
        slokken: document.getElementById("amount").value,
      },
    });
  };
  div2.appendChild(child);

  child = document.createElement("button");
  child.innerHTML = "Join Schoppen";
  child.setAttribute("class", "button");
  child.onclick = () => {
    console.log(localStorage.getItem("login_name"));
    socket.emit("paardenraceclientmessage", {
      action: "addSpeler",
      data: {
        speler: localStorage.getItem("login_name"),
        soortKeuze: "S",
        slokken: document.getElementById("amount").value,
      },
    });
  };
  div2.appendChild(child);
  parent.appendChild(div2);

  const div3 = document.createElement("div");

  child = document.createElement("button");
  child.innerHTML = "Start spel";
  child.setAttribute("class", "button");
  child.onclick = () => {
    if (confirm("Spel starten?")) {
      socket.emit("paardenraceclientmessage", {
        action: "start",
      });
    }
  };
  div3.appendChild(child);

  child = document.createElement("button");
  child.innerHTML = "Reset spel";
  child.setAttribute("class", "button");
  child.onclick = () => {
    if (confirm("Wil je echt resetten?")) {
      socket.emit("paardenraceclientmessage", {
        action: "reset",
      });
    }
  };
  div3.appendChild(child);

  parent.appendChild(div3);
};

updatePostStartView = function (end) {
  const parent = document.getElementById("buttonwrapper");
  parent.innerHTML = "";
  if (!end) {
    let child = document.createElement("button");
    child.innerHTML = "Volgende kaart";
    child.setAttribute("class", "button");
    child.onclick = () => {
      socket.emit("paardenraceclientmessage", {
        action: "next",
      });
    };
    parent.appendChild(child);
  }

  child = document.createElement("button");
  child.innerHTML = "Reset spel";
  child.setAttribute("class", "button");
  child.onclick = () => {
    if (confirm("Wil je echt resetten?")) {
      socket.emit("paardenraceclientmessage", {
        action: "reset",
      });
    }
  };
  parent.appendChild(child);
};
