setLoginField = function () {
  if (typeof Storage !== "undefined") {
    if (
      localStorage.getItem("login_name") === null ||
      localStorage.getItem("login_key") === null
    ) {
      //niet ingelogd
      document.getElementById("loginButton").onclick = () => {
        let name = document.getElementById("username").value;
        let pwd = document.getElementById("password").value;
        handlelogin(name, pwd);
      };
    } else {
      var container = document.getElementById("loginfield");
      container.innerHTML = "";
      var label = document.createElement("p");
      label.innerHTML = "Ingelogd als " + localStorage.getItem("login_name");
      container.appendChild(label);
      const child1 = document.createElement("button");
      child1.innerHTML = "Log uit";
      child1.setAttribute("class", "loginbutton");
      child1.onclick = () => {
        localStorage.removeItem("login_name");
        localStorage.removeItem("login_key");
        location.reload();
      };
      container.appendChild(child1);
    }
  } else {
    document.getElementById("error").innerHTML =
      "Login gefaald, contacteer support";
  }
};

handlelogin = function (username, pwd) {
  fetch("./login/username/" + username + "/hash/" + MD5(pwd))
    .then(function (response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }

      // Examine the text in the response

      response.json().then(function (data) {
        if (data.status === "OK") {
          //console.log("Naam:" + username);
          localStorage.setItem("login_name", username);
          localStorage.setItem("login_key", data.token);
          location.reload();
        } else {
          document.getElementById("error").innerHTML = "Fout: " + data.reason;
        }
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
};

setLoginField();
