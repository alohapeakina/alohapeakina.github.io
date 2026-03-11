//Global variables
let randomNumber;
let MAX_ATTEMPTS = 7;
let attempts = 0;
let remainingAttempts = MAX_ATTEMPTS

//Event listeners
document.querySelector("#guessBtn").addEventListener("click",checkGuess);
document.querySelector("#resetBtn").addEventListener("click",initializeGame);

initializeGame();

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log("randomNumber: " + randomNumber);
    attempts = 0;
    
    //hiding the Reset button
    document.querySelector("#resetBtn").style.display="none";

    //showing the Guess button
    document.querySelector("#guessBtn").style.display = "inline";

    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.focus(); //adding focus to textbox
    playerGuess.value = ""; //clearing the textbox

    let feedback = document.querySelector("#feedback");
    feedback.textContent = ""; //clearing the feedback

    let remainingAttempts = document.querySelector("#remainingAttempts");
    remainingAttempts.textContent = MAX_ATTEMPTS;

    //clearing previous guesses
    document.querySelector("#guesses").textContent = "";
    
}

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player guess: " + guess);
    if (guess < 1 || guess > 99) {
        feedback.textContent = "Enter a number between 1 and 99";
        feedback.style.color = "red";
        return;
    }
    attempts++;
    remainingAttempts--;
    document.querySelector("#remainingAttempts").textContent = remainingAttempts;
    console.log("Attempts: " + attempts);
    console.log("Remaining Attempts: " + remainingAttempts);
    feedback.style.color = "orange";
    if (guess == randomNumber) {
        feedback.textContent = "You guessed it! You Won!";
        feedback.style.color = "darkgreen";
        gameOver();
    } else {
        document.querySelector("#guesses").textContent += guess + " ";
        if (attempts == MAX_ATTEMPTS) {
            feedback.textContent = "Sorry, you lost!";
            feedback.style.color = "red";
            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Guess was high";
        } else {
            feedback.textContent = "Guess was low";
        }
    }
}

function gameOver() {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    guessBtn.style.display = "none";
    resetBtn.style.display = "inline";
}