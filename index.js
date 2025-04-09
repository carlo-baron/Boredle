current_word = [];
letter_tiles = document.getElementsByClassName("tile");

delete_button = document.getElementById("dlt");
enter_button = document.getElementById("enter");

let current_row = 0;
var letter_stack = [];

let random_word = "";
let win = false;

fetch("./wordlist.json")
  .then((response) => response.json())
  .then((data) => {
    const dailyWords = data.dailies;
    random_word = dailyWords[Math.floor(Math.random() * dailyWords.length)];
  });

function UpdateLetters() {
    if(win) return;
  for (let i = 0; i < 5; i++) {
    letter_tiles[RowStart() + i].textContent = letter_stack[i];
  }
}

delete_button.addEventListener("click", function () {
  letter_stack.pop();
  UpdateLetters();
});

document.addEventListener('keydown', function (event) {
    const key = event.key.toUpperCase();

    const button = Array.from(document.querySelectorAll('.keyboard .btn')).find(btn => btn.textContent.toUpperCase() === key);

    if (button) {
        button.click();
    }

    if (key === 'ENTER') {
        enter_button.click();
    } else if (key === 'BACKSPACE') {
        delete_button.click();
    }
});

enter_button.addEventListener("click", function () {
  if (letter_stack.length < 5) return;

  fetch("./wordlist.json")
    .then((response) => response.json())
    .then((data) => {
      const word = letter_stack.join("").toLowerCase();

      if (!data.guesses.includes(word) && !data.dailies.includes(word)) return;

      let random_word_split = random_word.split("");
      for (let i = 0; i < 5; i++) {
        let current_letter = word[i];
        let element = letter_tiles[RowStart() + i];
        if (random_word_split.includes(current_letter)) {
          if (random_word_split.indexOf(current_letter) === i) {
            element.style.backgroundColor = "green";
            random_word_split[i] = " ";
          } else {
            element.style.backgroundColor = "yellow";
            random_word_split[random_word_split.indexOf(current_letter)] = " ";
          }
        } else {
          element.style.backgroundColor = "gray";
        }
      }
      if (word == random_word) {
        win = true;
        return;
      } else {
        ChangeRow();
      }
    });
});

function GetLetter(button) {
  letter = button.textContent;
  if (letter_stack.length >= 5) return;
  letter_stack.push(letter);
  UpdateLetters();
}

function ChangeRow() {
  letter_stack = [];
  current_row++;
}

function RowStart() {
  switch (current_row) {
    case 0:
      return 0;
    case 1:
      return 5;
    case 2:
      return 10;
    case 3:
      return 15;
    case 4:
      return 20;
    case 5:
      return 25;
  }
}
