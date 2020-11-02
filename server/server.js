// Import packages
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const fs = require("fs");
const nodeoutlook = require("nodejs-nodemailer-outlook");

const Dobbelspel = require("./games/dobbelspel").Dobbelspel;
const PigeonSpel = require("./games/pigeon").PigeonSpel;
const MexicoSpel = require("./games/mexico").MexicoSpel;
const BadjeleggenSpel = require("./games/badjeleggen").Badjeleggen;
const FuckdendealerSpel = require("./games/fuckdendealer").Fuckdendealer;
const PiramideSpel = require("./games/piramide").Piramide;
const PaardenraceSpel = require("./games/paardenrace").Paardenrace;

const Userdata = require("./userdata").Userdata;
const users = require("./../userdata.json");

// Configuration
const PORT = process.env.PORT || 3000;
console.log(path.resolve("client"));

// Game variables
const piramideRijen = 4;
const paardenraceLengte = 5;
// Games
let ds = new Dobbelspel();
let ps = new PigeonSpel();
let ms = new MexicoSpel();
let bls = new BadjeleggenSpel();
let fdds = new FuckdendealerSpel();
let pirs = new PiramideSpel(piramideRijen);
let prs = new PaardenraceSpel(paardenraceLengte);

let userdata = new Userdata(users);

// Start server
const server = express()
  .get("/", (req, res) => res.sendFile(path.resolve("client/html/index.html")))
  .get("/login/username/:un/hash/:hash", function (req, res) {
    console.log(req.params + " " + req.un);
    res.send(userdata.login(req.params.un, req.params.hash));
  })
  .get("/auth/username/:un/token/:token", function (req, res) {
    console.log(req.params);
    res.send(userdata.authorize(req.params.un, req.params.token));
  })
  .get("/new/username/:un/hash/:hash", function (req, res) {
    console.log(req.params);
    var resp = userdata.add(req.params.un, req.params.hash);
    console.log("New: " + resp);
    if (resp.response.status === "OK") {
      fs.writeFile(
        "./userdata.json",
        JSON.stringify(resp.userlist),
        "utf8",
        function (err) {
          if (err) throw err;
          console.log("Saved!");
        }
      );
      sendNewUser(resp.userlist[resp.userlist.length - 1]);
    }
    res.send(resp.response);
  })
  .use(express.static(path.resolve("client")))
  .listen(PORT, () => console.log("Listening on localhost:" + PORT));

//Initiatlize SocketIO
const io = socketIO(server);

dobbelspelHandler = function (socket, room) {
  socket.on("dobbelclientmessage", (msg) => {
    ds.setAantalDobbelstenen(msg.nDice);
    ds.dobbel();
    console.log("Dobbelspel: " + msg.name + " gooit " + ds.bekijk());
    socket.broadcast
      .to(room)
      .emit("dobbelservermessage", { name: msg.name, dice: ds.bekijk() });
  });
};

pigeonspelHandler = function (socket, room) {
  socket.on("pigeonclientmessage", (msg) => {
    let r = ps.speel(msg.name);
    console.log("Pigeon: " + msg.name + " gooit " + r.dice);
    socket.broadcast.to(room).emit("pigeonservermessage", r);
  });

  socket.on("pigeonreset", (msg) => {
    ps = new PigeonSpel();
  });
};

mexicospelHandler = function (socket, room) {
  socket.on("mexicoclientmessage", (msg) => {
    let r = ms.input(msg);
    console.log("Mexico: " + msg.action + " -> " + r.return);
    ms.printState();
    socket.broadcast.to(room).emit("mexicoservermessage", r);
  });
  socket.emit("mexicoservermessage", ms.input({ action: "status" }));
};

badjeleggenHandler = function (socket, room) {
  socket.on("badjeleggenclientmessage", (msg) => {
    let r = bls.input(msg);
    console.log("Badjeleggen: " + msg.action + " -> " + r.return);
    bls.printState();
    socket.broadcast.to(room).emit("badjeleggenservermessage", r);
  });
  socket.emit("badjeleggenservermessage", bls.input({ action: "status" }));
};

fuckdendealerHandler = function (socket, room) {
  socket.on("fuckdendealerclientmessage", (msg) => {
    let r = fdds.input(msg);
    console.log("Fuckdendealer: " + msg.action + " -> " + r.return);
    fdds.printStatus();
    io.to(room).emit("fuckdendealerservermessage", r);
  });
  socket.emit("fuckdendealerservermessage", fdds.input({ action: "status" }));
};

paardenraceHandler = function (socket, room) {
  socket.on("paardenraceclientmessage", (msg) => {
    let r = prs.input(msg);
    console.log("Paardenrace: " + msg.action + " -> " + r.return);
    //prs.printStatus();
    io.to(room).emit("paardenraceservermessage", r);
  });
  socket.emit("paardenraceservermessage", prs.input({ action: "status" }));
};

piramideHandler = function (socket, room) {
  socket.on("piramideclientmessage", (msg) => {
    let r = pirs.input(msg);
    console.log("Piramide: " + msg.action + " -> " + r.return);
    //pirs.printStatus();
    io.to(room).emit("piramideservermessage", r);
  });
  socket.emit("piramideservermessage", pirs.input({ action: "status" }));
};

// Websocket Connections
io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
    if (room === "dobbelspel") {
      console.log("Join dobbel");
      dobbelspelHandler(socket, room);
    }
    if (room === "pigeon") {
      console.log("Join pigeon");
      pigeonspelHandler(socket, room);
    }
    if (room === "mexico") {
      console.log("Join mexico");
      mexicospelHandler(socket, room);
    }
    if (room === "badjeleggen") {
      console.log("Join badjeleggen");
      badjeleggenHandler(socket, room);
    }
    if (room === "fuckdendealer") {
      console.log("Join fuckdendealer");
      fuckdendealerHandler(socket, room);
    }
    if (room === "paardenrace") {
      console.log("Join paardenracedealer");
      paardenraceHandler(socket, room);
    }
    if (room === "piramide") {
      console.log("Join piramide");
      piramideHandler(socket, room);
    }
  });
});

sendNewUser = function (user) {
  nodeoutlook.sendEmail({
    auth: {
      user: "bubbelgames@outlook.com",
      pass: "kJ3kY9EBDmYX",
    },
    from: "bubbelgames@outlook.com",
    to: "bubbelgames@outlook.com",
    subject: "New user: " + user.username,
    text: JSON.stringify(user),
    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i),
    tls: {
      rejectUnauthorized: false,
    },
  });
};
