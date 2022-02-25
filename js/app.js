const mainEl = document.querySelector("main");
const messageBoxEl = document.querySelector(".message-box");
const msgEl = document.querySelector(".message-box > h3");
const playAgainBtnEl = document.querySelector(".message-box > button");

const words = [
  "HYPER",
  "HELLO",
  "BREAD",
  "CRAVE",
  "SMART",
  "BLOKE",
  "CHOKE",
  "PLANE",
  "ABUSE",
  "ADULT",
  "AGENT",
  "APPLE",
  "AWARD",
  "BASIS",
  "BEACH",
  "CLOCK",
  "CYCLE",
  "DEPTH",
  "DRAMA",
  "DRESS",
  "DRINK",
  "EVENT",
  "ENEMY",
  "ENTRY",
  "FIELD",
  "FAULT",
  "FLOOR",
  "FORCE",
  "GLASS",
  "GREEN",
  "GUIDE",
  "HEART",
  "HORSE",
  "HOTEL",
  "IMAGE",
  "INDEX",
  "INPUT",
  "MOTOR",
  "PANEL",
  "PILOT",
  "PLANE",
  "PRIDE",
  "QUEEN",
  "RIVER",
  "RIGHT",
  "RUGBY",
  "SCORE",
  "SENSE",
  "SHAPE",
  "SHEET",
  "SMITH",
  "TABLE",
  "TOTAL",
  "TOUCH",
  "TRACK",
  "TRUST",
  "UNION",
  "UNITY",
  "VALUE",
  "VIDEO",
  "VISIT",
  "WATER",
  "WHILE",
  "YOUTH",
];

const state = {
  winningWord: null,
  letterIdx: 0,
  wordIdx: 0,
  currentGuessMatrix: [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ],
};

document.addEventListener("keydown", function (e) {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    registerLetter(e.key);
  } else if (e.key === "Backspace") {
    removeLetter();
  } else if (e.key === "Enter") {
    submitWord();
  }
});

playAgainBtnEl.addEventListener("click", init);

function checkWin() {
  const guessedWord = state.currentGuessMatrix[state.wordIdx].join("");
  if (guessedWord === state.winningWord) {
    msgEl.textContent = "Congrats you win!";
    messageBoxEl.style.display = "block";
  } else if (state.wordIdx === 4) {
    msgEl.textContent = "Sorry you lost! Try again!";
    messageBoxEl.style.display = "block";
  } else {
    state.wordIdx++;
    state.letterIdx = 0;
  }
}

function submitWord() {
  if (!state.currentGuessMatrix[state.wordIdx].includes(null)) {
    state.currentGuessMatrix[state.wordIdx].forEach((letter, idx) => {
      if (state.winningWord[idx] === letter) {
        mainEl.children[state.wordIdx].children[
          idx
        ].lastElementChild.lastElementChild.style.backgroundColor = "#16AC26";
      } else if (state.winningWord.includes(letter)) {
        mainEl.children[state.wordIdx].children[
          idx
        ].lastElementChild.lastElementChild.style.backgroundColor = "#D7D85C";
      } else {
        mainEl.children[state.wordIdx].children[
          idx
        ].lastElementChild.lastElementChild.style.backgroundColor = "#282828";
      }
    });
    renderAnimation();
  }
}

function removeLetter() {
  if (
    state.letterIdx === 5 ||
    state.currentGuessMatrix[state.wordIdx][state.letterIdx] === null
  ) {
    if (state.letterIdx > 0) state.letterIdx--;
    state.currentGuessMatrix[state.wordIdx][state.letterIdx] = null;
  } else if (state.letterIdx >= 0) {
    state.currentGuessMatrix[state.wordIdx][state.letterIdx] = null;
    state.letterIdx--;
  }
  render();
}

function registerLetter(letter) {
  if (
    state.currentGuessMatrix[state.wordIdx][state.letterIdx] === null &&
    state.letterIdx < 5
  ) {
    state.currentGuessMatrix[state.wordIdx][state.letterIdx] =
      letter.toUpperCase();
    state.letterIdx++;
  } else if (
    state.currentGuessMatrix[state.wordIdx][state.letterIdx] !== null &&
    state.letterIdx < 4
  ) {
    state.letterIdx++;
    state.currentGuessMatrix[state.wordIdx][state.letterIdx] =
      letter.toUpperCase();
  }
  render();
}

function selectWinningWord() {
  state.winningWord = words[Math.floor(Math.random() * words.length)];
}

function init() {
  state.winningWord = null;
  state.letterIdx = 0;
  state.wordIdx = 0;
  state.currentGuessMatrix.forEach((row, rowIdx) => {
    row.forEach((letter, letterIdx) => {
      state.currentGuessMatrix[rowIdx][letterIdx] = null;
      mainEl.children[rowIdx].children[letterIdx].classList.remove(
        "letter-container-active"
      );
    });
  });

  msgEl.textContent = "";
  messageBoxEl.style.display = "none";

  selectWinningWord();
  render();
}

function renderAnimation() {
  let counter = 0;
  let animationInterval = setInterval(() => {
    if (counter < 5) {
      mainEl.children[state.wordIdx].children[counter].classList.add(
        "letter-container-active"
      );
      counter++;
    } else {
      clearInterval(animationInterval);
      checkWin();
    }
  }, 300);
}

function render() {
  let rowIdx = 0;
  for (let row of mainEl.children) {
    let letterIdx = 0;
    for (let letter of row.children) {
      letter.firstElementChild.firstElementChild.textContent =
        state.currentGuessMatrix[rowIdx][letterIdx];
      letter.lastElementChild.lastElementChild.textContent =
        state.currentGuessMatrix[rowIdx][letterIdx];
      letterIdx++;
    }
    rowIdx++;
  }
}

init();
