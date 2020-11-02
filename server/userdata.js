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
    return this._users.map((user) => user.username).includes(username);
  }
}

module.exports = {
  Userdata: Userdata,
};
