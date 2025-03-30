let items = [];
fetch("items.json")
  .then((response) => response.json())
  .then((data) => {
    items = data;
    createGrid();
  });

const sizeOfContainer = 12;
const numberOfIttem = 90;
let displayItems = [];
let score = 0;
let winScore = 10;
let selectStatus = new Array(sizeOfContainer).fill(false);
let mode = 0;

//new round when answer correct
function newRound() {
  displayItems = [];
  selectStatus = new Array(sizeOfContainer).fill(false);
  document.getElementById("score").innerText = score.toString();
  nextContainer();
  createGrid();
}

//random and place item in laggage
function createGrid() {
  gridContainer.innerHTML = "";
  for (let index = 0; index < sizeOfContainer; index++) {
    const id = Math.floor(Math.random() * numberOfIttem);
    const item = items[id];
    displayItems.push(item);

    var img = document.createElement("IMG");
    img.setAttribute("src", item.img);
    img.classList.add("item-img");

    let div = document.createElement("div");
    div.appendChild(img);
    div.classList.add("grid-item");
    div.addEventListener("mousedown", function (event) {
      if (event.button === 0) {
        select(index);
      } else if (event.button === 2) {
        showdetail(index);
      }
    });
    document.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
    gridContainer.appendChild(div);
  }
}

//show item's detail
function showdetail(index) {
  document.getElementById("showimgModal").style.display = "block";
  document.getElementById("bigimage").src = displayItems[index].img;
  document.getElementById("textdetail").innerText = displayItems[index].name;
}

//when choosing that item
function select(index) {
  if (selectStatus[index]) {
    selectStatus[index] = false;
    document.querySelectorAll(".grid-item")[index].classList.remove("select");
  } else {
    selectStatus[index] = true;
    document.querySelectorAll(".grid-item")[index].classList.add("select");
  }
}

//check all condition of each items
function checkItem() {
  let limitPowerbank = 2;
  let countPowerbank = 0;
  let powerbankIndex = [];

  let limitLiquid = 1000;
  let countliquid = 0;
  let liquidIndex = [];

  let ansSelect = [];

  for (let index = 0; index < sizeOfContainer; index++) {
    if (displayItems[index].type == "deny") ansSelect.push(true);
    else if (displayItems[index].type == "allow") ansSelect.push(false);
    else {
      if (displayItems[index].amount > displayItems[index].limit)
        ansSelect.push(true);
      else ansSelect.push(false);

      if (displayItems[index].type == "powerbank") {
        countPowerbank += displayItems[index].amount;
        powerbankIndex.push(index);
      } else if (displayItems[index].type == "liquid") {
        countliquid += displayItems[index].amount;
        liquidIndex.push(index);
      }
    }
  }

  if (countPowerbank > limitPowerbank) {
    for (let i = 0; i < powerbankIndex.length; i++)
      ansSelect[powerbankIndex[i]] = true;
  }

  if (countliquid > limitLiquid) {
    for (let i = 0; i < liquidIndex.length; i++)
      ansSelect[liquidIndex[i]] = true;
  }

  console.log(ansSelect);

  return ansSelect;
}

//*************Temporary*************//
// document.getElementById("win-skip").addEventListener("click", () => {
//   playCorreectEff();

//   document.getElementById("winModal").style.display = "block";
//   document.getElementById("score-result").innerHTML = `your score : ${score}`;
//   document.getElementById("manual-btn").style.display = "none";
// });
// document.getElementById("lose-skip").addEventListener("click", () => {
//   document.getElementById("manual-btn").style.display = "none";
//   newRound();

//   playWrongEff();
//   document.getElementById("wrongModal").style.display = "block";
//   document.getElementById("result").innerHTML = wrongText
//     .map((text) => {
//       return `<li>${text}</li>`;
//     })
//     .join("");
//   document.getElementById("lastscore").innerText =
//     "your score is " + score.toString();
// });
//*************Temporary*************//

//done button to finish this round
document.getElementById("done-btn").addEventListener("click", () => {
  let ansSelect = checkItem();
  let wrongText = [];

  console.log(selectStatus);
  for (let i = 0; i < sizeOfContainer; i++) {
    if (
      ansSelect[i] != selectStatus[i] &&
      !wrongText.includes(displayItems[i].text_wrongcase)
    ) {
      wrongText.push(displayItems[i].text_wrongcase);
    }
  }

  if (wrongText.length == 0) {
    score += 1;
    if (score == winScore) {
      document.getElementById("winModal").style.display = "block";

      document.getElementById(
        "score-result"
      ).innerHTML = `your score : ${score}`;
      document.getElementById("manual-btn").style.display = "none";
    } else {
      newRound();
      playCorreectEff();
    }
  } else {
    playWrongEff();
    document.getElementById("wrongModal").style.display = "block";
    document.getElementById("manual-btn").style.display = "none";
    document.getElementById("result").innerHTML = wrongText
      .map((text) => {
        return `<li>${text}</li>`;
      })
      .join("");
    document.getElementById("lastscore").innerText =
      "your score is " + score.toString();
  }
});

// When the user clicks on <span> (x), close the modal
document.getElementsByClassName("restart")[0].onclick = function () {
  window.location.href = "play.html";
};

document.getElementsByClassName("restart")[1].onclick = function () {
  window.location.href = "play.html";
};

document.querySelectorAll(".home-btn").forEach((button) => {
  button.onclick = () => (window.location.href = "index.html");
});

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//   if (event.target == document.getElementById("wrongModal")) {
//     document.getElementById("wrongModal").style.display = "none";
//   }
// };

document.getElementById("setting-modal").style.display = "none";

document.getElementById("setting-btn").addEventListener("click", () => {
  document.getElementById("setting-modal").style.display = "flex";
  document.getElementById("manual-btn").style.display = "none";
});

document.getElementsByClassName("close")[1].onclick = function () {
  document.getElementById("showimgModal").style.display = "none";
};

document.querySelector(".return-btn").addEventListener("click", function () {
  document.getElementById("setting-modal").style.display = "none";
});

document.getElementById("manual-btn").onclick = function () {
  document.getElementById("manual-btn").style.display = "none";
  document.getElementById("manualModal").style.display = "block";
};

document.getElementsByClassName("close")[0].onclick = function () {
  document.getElementById("manual-btn").style.display = "flex";
  document.getElementById("manualModal").style.display = "none";
};

function openContainer() {
  document.getElementById("play-container").style.display = "block";
  document.getElementsByClassName("conveyor")[0].style.display = "none";
  document.getElementById("name").style.display = "none";
}

function nextContainer() {
  document.getElementById("play-container").style.display = "none";
  document.getElementsByClassName("conveyor")[0].style.display = "block";

  var element1 = document.getElementsByClassName("luggage1")[0];
  element1.style.animation = "none";
  setTimeout(() => {
    element1.style.animation = "moveLuggage1 8s linear forwards";
  }, 10);

  var element2 = document.getElementsByClassName("luggage2")[0];
  element2.style.animation = "none";
  setTimeout(() => {
    element2.style.animation = "moveLuggage2 8s linear forwards";
  }, 10);
}

function playWrongEff() {
  var sound = document.getElementById("wrong-eff");
  sound.play();
}

function playCorreectEff() {
  var sound = document.getElementById("correct-eff");
  sound.play();
}

document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("backgroundAudio");
  const toggleBtn = document.getElementById("toggleSound");
  const volumeSlider = document.getElementById("volumeSlider");

  audio.volume = volumeSlider.value;

  const tryUnmute = () => {
    audio.muted = false;
    toggleBtn.textContent = "🔊";
    audio.play().catch((e) => {
      audio.muted = true;
      toggleBtn.textContent = "🔇";
    });
  };

  document.body.addEventListener("click", tryUnmute, { once: true });

  toggleBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    toggleBtn.textContent = audio.muted ? "🔇" : "🔊";
    if (!audio.muted) audio.play();
  });

  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
  });
});
