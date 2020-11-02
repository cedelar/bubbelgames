const md5 = require("md5");

class Userdata {
  constructor(data) {
    this._pr_key = 2788020459;
    this._users = data;
    console.log(this._users);
  }

  get users() {
    return this._users;
  }

  add(username, hash) {
    if (this._isAlphaNumeric(username)) {
      if (!this.checkInUse(username)) {
        var user = {
          username: username,
          hash: hash,
          rank: "",
        };
        this._users.push(user);
        return { response: { status: "OK" }, userlist: this._users };
      }
      return {
        response: {
          status: "NOK",
          message: "Gebuikersnaam bestaat al, kies een andere.",
        },
      };
    }

    return {
      response: {
        status: "NOK",
        message: "Gebuikersnaam bevat illegale tekens, kies een andere.",
      },
    };
  }

  login(username, hash) {
    console.log(username + " " + hash);
    if (this.checkInUse(username)) {
      var inloguser = this._users.find((user) => user.username === username);
      console.log("Inlog: " + inloguser.username);
      if (inloguser.hash === hash) {
        console.log("OK");
        return {
          status: "OK",
          token: md5(username + this._pr_key),
        };
      } else {
        console.log("NOK");
        return { status: "NOK", reason: "Passwoord incorrect" };
      }
    } else {
      console.log("NOK");
      return { status: "NOK", reason: "Onbekende usernaam" };
    }
  }

  authorize(username, token) {
    if (token === md5(username + this._pr_key)) {
      return { status: "OK" };
    } else {
      return { status: "NOK" };
    }
  }

  checkInUse(username) {
    if (username.toLowerCase().includes("larry")) {
      return true;
    }
    return this._users.map((user) => user.username).includes(username);
  }

  _isAlphaNumeric(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (
        !(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123) // lower alpha (a-z)
      ) {
        return false;
      }
    }
    return true;
  }
}

module.exports = {
  Userdata: Userdata,
};
