//Elements in memory
const mainEl = document.querySelector("main");
const wordEls = document.querySelectorAll(".word");
const gameEndBox = document.querySelector(".game-end-box");
const keyboardEl = document.querySelector(".keyboard");
const keyEls = document.querySelectorAll(".key");

//Global Vars / state
const state = {
  wordMatrix: [
    [
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
    ],
    [
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
    ],
    [
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
    ],
    [
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
    ],
    [
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
    ],
    [
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
      { letter: "", backgroundColor: "black" },
    ],
  ],
  wordCount: 0,
  letterCount: 0,
  winningWord: "",
};

//API functions

const RANDOM_WORD_API_URL = "https://random-words5.p.rapidapi.com/getRandom";
const DICTIONARY_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

function getWordFromAPI() {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "026d94561dmsh3f279550ac22121p153a73jsn29f74346801c",
      "X-RapidAPI-Host": "random-words5.p.rapidapi.com",
    },
  };

  fetch(RANDOM_WORD_API_URL + "?wordLength=5", options)
    .then((response) => response.body.getReader())
    .then((reader) => {
      reader.read().then((body) => {
        let string = new TextDecoder().decode(body.value);
        state.winningWord = string.toUpperCase();
      });
    })
    .catch((err) => console.error(err));
}

function checkWordWithAPI(word) {
  fetch(DICTIONARY_API_URL + word)
    .then((response) => response.json())
    .then((res) => {
      if (res[0]) {
        checkLetters();
      } else {
        renderShakeAnimation();
      }
    })
    .catch((err) => console.log(err));
}

//Event Listeners
document.addEventListener("keydown", handleKeyPress);
keyboardEl.addEventListener("click", handleClick);

//Functions
function handleClick(evt) {
  if (!evt.target.classList.contains("key")) return;
  if (evt.target.textContent === "ENTER") {
    if (
      state.letterCount === 4 &&
      state.wordMatrix[state.wordCount][state.letterCount].letter
    ) {
      let currentWord = generateStringFromMatrix();
      checkWordWithAPI(currentWord);
    }
  } else if (evt.target.textContent === "DELETE") {
    removeLetter();
  } else {
    setLetter(evt.target.textContent);
  }
}

function handleKeyPress(evt) {
  //evt.key is going to hold the actual key value
  if (evt.key.toLowerCase() === "enter") {
    if (
      state.letterCount === 4 &&
      state.wordMatrix[state.wordCount][state.letterCount].letter
    ) {
      let currentWord = generateStringFromMatrix();
      checkWordWithAPI(currentWord);
    }
  } else if (evt.key.toLowerCase() === "backspace") {
    removeLetter();
  } else if (lettersOnly(evt.keyCode)) {
    //Is a letter
    setLetter(evt.key);
  }
}

function removeLetter() {
  if (
    state.letterCount > 0 &&
    !state.wordMatrix[state.wordCount][state.letterCount].letter
  ) {
    state.letterCount--;
    state.wordMatrix[state.wordCount][state.letterCount].letter = "";
  } else if (state.letterCount > 0) {
    state.wordMatrix[state.wordCount][state.letterCount].letter = "";
    state.letterCount--;
  } else {
    state.wordMatrix[state.wordCount][state.letterCount].letter = "";
  }
  render();
}

function checkLetters() {
  const letterFreq = frequencyCounter(state.winningWord);

  state.wordMatrix[state.wordCount].forEach((letterObj, idx) => {
    let keyElement = Array.from(keyEls).find(
      (key) => key.textContent === letterObj.letter
    );
    if (state.winningWord.includes(letterObj.letter)) {
      if (state.winningWord[idx] === letterObj.letter) {
        if (letterFreq[letterObj.letter].count > 0) {
          letterObj.backgroundColor = "#16AC26";
          keyElement.style.backgroundColor = "#16AC26";
          letterFreq[letterObj.letter].count--;
          letterFreq[letterObj.letter].color = "green";
        } else if (letterFreq[letterObj.letter].color === "yellow") {
          letterObj.backgroundColor = "#16AC26";
          let yellowLetter = state.wordMatrix[state.wordCount].find(
            (l) =>
              l.letter === letterObj.letter && l.backgroundColor === "#D7D85C"
          );
          yellowLetter.backgroundColor = "#282828";
          letterFreq[letterObj.letter].color = "green";
        }
      } else {
        if (letterFreq[letterObj.letter].count > 0) {
          letterObj.backgroundColor = "#D7D85C";
          keyElement.style.backgroundColor = "#D7D85C";
          letterFreq[letterObj.letter].count--;
          letterFreq[letterObj.letter].color = "yellow";
        } else {
          if (
            !(
              letterFreq[letterObj.letter].color === "yellow" ||
              letterFreq[letterObj.letter].color === "green"
            )
          ) {
            keyElement.style.backgroundColor = "#282828";
          }
          letterObj.backgroundColor = "#282828";
        }
      }
    } else {
      keyElement.style.backgroundColor = "#282828";
      letterObj.backgroundColor = "#282828";
    }
  });
  debugger;
  renderAnimation();
}

function generateStringFromMatrix() {
  let currentWord = state.wordMatrix[state.wordCount].reduce(
    (acc, letterObj) => {
      return acc + letterObj.letter;
    },
    ""
  );
  return currentWord;
}

function checkForWin() {
  let currentWord = generateStringFromMatrix();

  //come back and make this DRY
  if (state.winningWord === currentWord) {
    const text = document.createTextNode("You Win!");
    gameEndBox.prepend(text);
    gameEndBox.style.display = "flex";
    gameEndBox.children[0].addEventListener("click", function () {
      init();
    });
  } else if (state.wordCount === 5) {
    const text = document.createTextNode(
      `You Lose! The word was ${state.winningWord}`
    );
    gameEndBox.prepend(text);
    gameEndBox.style.display = "flex";
    gameEndBox.children[0].addEventListener("click", function () {
      init();
    });
  } else {
    state.letterCount = 0;
    state.wordCount++;
  }
}

function setLetter(letter) {
  if (
    state.wordMatrix[state.wordCount][state.letterCount].letter &&
    state.letterCount < 4
  ) {
    state.letterCount++;
  }
  if (!state.wordMatrix[state.wordCount][state.letterCount].letter) {
    state.wordMatrix[state.wordCount][state.letterCount].letter =
      letter.toUpperCase();
  }
  render();
  if (state.letterCount < 4) {
    state.letterCount++;
  }
}

//https://stackoverflow.com/questions/16647404/javascript-function-to-enter-only-alphabets-on-keypress
function lettersOnly(charCode) {
  if (
    (charCode > 64 && charCode < 91) ||
    (charCode > 96 && charCode < 123) ||
    charCode == 8
  )
    return true;
  else return false;
}

function init() {
  state.letterCount = 0;
  state.wordCount = 0;
  state.winningWord = getWordFromAPI();
  if (gameEndBox.childNodes[0] != gameEndBox.children[0]) {
    gameEndBox.childNodes[0].remove();
  }
  gameEndBox.style.display = "none";
  keyEls.forEach((key) => (key.style.backgroundColor = "#f2f2f2"));

  state.wordMatrix.forEach((word, wordIdx) => {
    word.forEach((letter, letterIdx) => {
      state.wordMatrix[wordIdx][letterIdx] = {
        letter: "",
        backgroundColor: "black",
      };
      mainEl.children[wordIdx].children[letterIdx].classList.remove(
        "letter-container-active"
      );
    });
  });
  render();
}

function render() {
  //wordEls is an array of words
  //words.children is an array of letters
  state.wordMatrix.forEach((word, wordIdx) => {
    word.forEach((letterObj, letterIdx) => {
      wordEls[wordIdx].children[
        letterIdx
      ].firstElementChild.firstElementChild.textContent = letterObj.letter;
      wordEls[wordIdx].children[
        letterIdx
      ].firstElementChild.lastElementChild.textContent = letterObj.letter;

      // wordEls[wordIdx].children[letterIdx].style.backgroundColor =
      //   letterObj.backgroundColor;
    });
  });
}

//triggers the flip animation on the tiles to reveal correct / incorrect letter guesses
function renderAnimation() {
  state.wordMatrix[state.wordCount].forEach((letter, idx) => {
    mainEl.children[state.wordCount].children[
      idx
    ].lastElementChild.lastElementChild.style.backgroundColor =
      letter.backgroundColor;
  });
  //remove event listener for when the animation is active to avoid the enter key using old state to check a word before the state is cleared.
  document.removeEventListener("keydown", handleKeyPress);
  let counter = 0;
  //every 3 seconds the letter container active class will be applied to the tile to trigger the flip animation
  //the colours are already applied to the back of the title at this point
  let animationInterval = setInterval(() => {
    if (counter < 5) {
      mainEl.children[state.wordCount].children[counter].classList.add(
        "letter-container-active"
      );
      counter++;
    } else {
      //remove the interval, add the event listener and check for the win condition once the animation is over
      clearInterval(animationInterval);
      document.addEventListener("keydown", handleKeyPress);
      checkForWin();
    }
  }, 300);
}

function frequencyCounter(word) {
  tempObj = {};

  if (typeof word !== "string") {
    return false;
  }

  for (let i = 0; i < word.length; i++) {
    tempObj.hasOwnProperty(word[i])
      ? (tempObj[word[i]] = tempObj[word[i]].count += 1)
      : (tempObj[word[i]] = { count: 1, color: "" });
  }
  return tempObj;
}

function renderShakeAnimation() {
  wordEls[state.wordCount].classList.add("shake");
  setTimeout(() => {
    wordEls[state.wordCount].classList.remove("shake");
  }, 600);
}

init();
