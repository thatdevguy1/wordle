//more work coming
const mainEl = document.querySelector("main");
const messageBoxEl = document.querySelector(".message-box");
const msgEl = document.querySelector(".message-box > h3");
const playAgainBtnEl = document.querySelector(".message-box > button");

//static wordlist to be replaced by a word api in the future
const words = [
  "BEAST",
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
  //guess matrix represents an in memory version of the letter titles / word rows
  //this corresponds with the same kind of 2d array given to us by the html elements on the page
  currentGuessMatrix: [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ],
};

playAgainBtnEl.addEventListener("click", init);
document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  //check the events keycodes for a letter to register the letter
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    registerLetter(e.key);
    //if its not a letter check for a backspace to remove a letter
  } else if (e.key === "Backspace") {
    removeLetter();
    //if its not a backspace check for an enter to submit a guess
  } else if (e.key === "Enter") {
    submitWord();
  }
}

function checkWin() {
  //join the array to do a strict comparison between the guessed word and the winning word.
  const guessedWord = state.currentGuessMatrix[state.wordIdx].join("");
  if (guessedWord === state.winningWord) {
    //triggers a hidden box to show your winning message with the option to play again
    msgEl.textContent = "Congrats you win!";
    messageBoxEl.style.display = "flex";
  } else if (state.wordIdx === 4) {
    //or if you're out of words to guess shows a losing message with an option to play again
    msgEl.textContent = "Sorry you lost! Try again!";
    messageBoxEl.style.display = "flex";
  } else {
    //if you're not out of guesses, increases the counter for the amount of guesses you've used, sets the letterIdx to 0 for poisitoning purposes in the matrix and the game continues
    state.wordIdx++;
    state.letterIdx = 0;
  }
}

function submitWord() {
  //check to make sure there are no null values in the word array of our current word in the matrix
  if (!state.currentGuessMatrix[state.wordIdx].includes(null)) {
    state.currentGuessMatrix[state.wordIdx].forEach((letter, idx) => {
      //check to see if the guessed letter is an exact match with the same positioned letter in our winning word
      //if it is we set the background of the hidden element (that will be flipped) to green
      if (state.winningWord[idx] === letter) {
        mainEl.children[state.wordIdx].children[
          idx
        ].lastElementChild.lastElementChild.style.backgroundColor = "#16AC26";
        //check to see if the guessed letter is anywhere in the winning word
        //if it is we set the background of the hidden element (that will be flipped) to yellow
      } else if (state.winningWord.includes(letter)) {
        mainEl.children[state.wordIdx].children[
          idx
        ].lastElementChild.lastElementChild.style.backgroundColor = "#D7D85C";
      } else {
        //if both cases above are not met, set the background to a dark grey to represent there is no match
        mainEl.children[state.wordIdx].children[
          idx
        ].lastElementChild.lastElementChild.style.backgroundColor = "#282828";
      }
    });
    renderAnimation();
  }
}

//depending on the value of our current letterIdx vs where we should be removing a letter we remove the letter from the game state before or after decreasing the letterIdx (position on the bored)
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

//depending on the value of our current letterIdx vs where we should be inputting a letter we apply the letter into the game state before or after increasing the letterIdx (position on the bored)
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

//initialize the game state to default values and select a new word to be used
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

//triggers the flip animation on the tiles to reveal correct / incorrect letter guesses
function renderAnimation() {
  //remove event listener for when the animation is active to avoid the enter key using old state to check a word before the state is cleared.
  document.removeEventListener("keydown", handleKeyDown);
  let counter = 0;
  //every 3 seconds the letter container active class will be applied to the tile to trigger the flip animation
  //the colours are already applied to the back of the title at this point
  let animationInterval = setInterval(() => {
    if (counter < 5) {
      mainEl.children[state.wordIdx].children[counter].classList.add(
        "letter-container-active"
      );
      counter++;
    } else {
      //remove the interval, add the event listener and check for the win condition once the animation is over
      clearInterval(animationInterval);
      document.addEventListener("keydown", handleKeyDown);
      checkWin();
    }
  }, 300);
}

//renders the guessed letters to the bored
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
