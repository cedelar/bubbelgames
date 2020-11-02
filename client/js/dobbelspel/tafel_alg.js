const dicepath = "../../images/dice/";
getImage = function (ogen) {
  switch (ogen) {
    case 1:
      return dicepath + "dice1.png";
    case 2:
      return dicepath + "dice2.png";
    case 3:
      return dicepath + "dice3.png";
    case 4:
      return dicepath + "dice4.png";
    case 5:
      return dicepath + "dice5.png";
    case 6:
      return dicepath + "dice6.png";
    default:
      console.log("Invalid dobbelsteen: " + this._aantalOgen);
      return;
  }
};

getArrayRandom = function (amount) {
  var arr = [];
  while (arr.length < amount) {
    var r = Math.floor(Math.random() * 150);
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  console.log(arr);
  return arr;
};

renderDice = function (diceArray) {
  let randArray = getArrayRandom(diceArray.length);
  let parent = document.getElementById("imagewrapper");
  parent.innerHTML = "";
  for (let i = 0; i < 150; i++) {
    let child = document.createElement("img");
    if (randArray.includes(i)) {
      child.setAttribute("src", getImage(diceArray.pop()));
    }
    child.setAttribute("class", "dice");
    parent.appendChild(child);
  }
};
