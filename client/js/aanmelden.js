document.getElementById("newuser").onclick = () => {
  console.log("button");
  let name = document.getElementById("nameinput").value;
  let pwd1 = document.getElementById("pwd1input").value;
  let pwd2 = document.getElementById("pwd2input").value;
  if (pwd2 === pwd1) {
    handlenewuser(name, pwd1);
  } else {
    const mes = (document.getElementById("error").innerHTML =
      "De paswoorden komen niet overeen, probeer opnieuw.");
  }
};

handlenewuser = function (name, pwd1) {
  fetch("./../new/username/" + name + "/hash/" + MD5(pwd1))
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
          let par = document.getElementById("container");
          par.innerHTML = "";
          let child1 = document.createElement("div");
          child1.setAttribute("class", "grid-item");
          let child2 = document.createElement("h3");
          child2.innerHTML =
            "Uw account (" +
            name +
            ") is succesvol aangemaakt, u kunt nu inloggen.";
          child1.appendChild(child2);
          par.appendChild(child1);
          document.getElementById("newuser").setAttribute("value", "Terug");
          document.getElementById("newuser").onclick = () => {
            window.history.back();
          };
        } else {
          document.getElementById("error").innerHTML = "Fout: " + data.message;
        }
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
};
