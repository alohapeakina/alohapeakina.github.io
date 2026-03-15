// ======== GLOBAL VARIABLES ========
const quizForm = document.querySelector("#test-area");
const results = document.querySelector("#results-area");
const scoreText = document.querySelector("#score-text");
const attemptsText = document.querySelector("#total-attempts");
const validationFdbk = document.querySelector("#validationFdbk");
const submitBtn = document.querySelector("#submitBtn");
const resetBtn = document.querySelector("#resetBtn");

const TARGET_SCORE = 80;
var score = 0;

var attempts = localStorage.getItem("total_attempts");

// Setup for quiz. Options are used to randomize multiple choice questions
const QUIZ_SETUP = {
    q1: {
        options: ["North Dakota", "Montana", "South Dakota", "Wyoming"],
        answer: "southdakota"
    },
    q2: {
        options: ["Utah", "Arizona", "New Mexico", "Nevada"],
        answer: "arizona"
    },
    q3: {
        options: ["Mississippi", "Colorado", "Missouri", "Rio Grande"],
        answer: "missouri"
    },
    q4: {
        options: ["Michigan", "Superior", "Erie", "Huron"],
        answer: "superior"
    },
    q5: {
        options: ["Oahu", "Molokai", "Kauai", "Maui"],
        answer: "kauai"
    },
    q6: {
        answer: "false"
    },
    q7: {
        answer: ["losangeles", "sacramento", "sanfrancisco"]
    },
    q8: {
        answer: "ak"
    },
    q9: {
        answer: ["delaware", "de"]
    },
    q10: {
        answer: "1959-08-21"
    }
}

const quizKeys = Object.keys(QUIZ_SETUP);
quizKeys.forEach(buildQuestions);

// ======== EVENT LISENTERS ========
submitBtn.addEventListener("click",gradeQuiz);
resetBtn.addEventListener("click",resetQuiz);
quizForm.addEventListener("change",saveProgress);
window.addEventListener("load", loadProgress);


// ======== CORE LOGIC ========

// Identifies each question in order to shuffle
function buildQuestions(qKey) {
    const config = QUIZ_SETUP[qKey];

    if (config.options) {
        shuffleChoices(qKey, `#${qKey}Choices`);
    }
}

// Performs shuffling of multiple choice options that will be passed into HTML
function shuffleChoices(qName, elementId) {
    const element = document.querySelector(elementId);
    if (!element) return;

    let choices = _.shuffle(QUIZ_SETUP[qName].options);

    // Ensure the existing container is empty
    element.innerHTML = "";

    //Build the questions
    for (let i=0; i < choices.length; i++) {
        const html = buildChoiceHTML(qName, choices[i], i);
        element.innerHTML += html;
    }
}

// Replaces HTML with shuffled options
function buildChoiceHTML(qName, choiceText, index) {
    const answerValue = choiceText.toLowerCase().replace(/\s+/g, '');
    const choiceId = `${qName}a${index}`; // This identifies individual response options

    return `
        <div class="form-check">
            <input class="form-check-input" type="radio" name="${qName}" id="${choiceId}" value="${answerValue}">
            <label class="form-check-label" for="${choiceId}">${choiceText}</label>
        </div>`;
}

// Saves progress to local storage
function saveProgress() {
    const formData = new FormData(quizForm);
    const quizData = {};

    for (let [question, response] of formData.entries()) {
        if (!quizData[question]) {
            quizData[question] = response;
        } else {
            if (!Array.isArray(quizData[question])) {
                quizData[question] = [quizData[question]];
            }
            quizData[question].push(response);
        }
    }

    localStorage.setItem("quiz_progress", JSON.stringify(quizData));
    console.log("Progress Saved", quizData);
}

// Restores progress/answers on a page load
function loadProgress() {
    const savedResponses = JSON.parse(localStorage.getItem("quiz_progress"));
    if (!savedResponses) { // Early return if there is no progress to load
        return;
    }

    for (const question in savedResponses) {
        const val = savedResponses[question];
        const elements = document.querySelectorAll(`[name="${question}"]`);

        for (const option of elements) {

            if (option.type === "radio" || option.type === "checkbox") {
                if (Array.isArray(val)) { // Logic for handling multiple choice checkboxes
                    option.checked = val.includes(option.value);
                } else {
                    option.checked = (option.value === val);
                }
            } else {
                option.value = val;
            }

        }
    }

    // Resets quiz if re-loading a submitted quiz
    // const isSubmitted = localStorage.getItem("quiz_submitted");
    // if (isSubmitted === "true") {
    //     resetQuiz();
    // }
}

// Verifies all quiz questions have been answered
function isFormValid() {
    
    const questionCount = document.querySelectorAll(".card-body");
    let missingQuestions = [];
    
    
    for (let i=1; i<=questionCount.length; i++) {
        let isAnswered = false;
        
        // Gets input for each question
        const input = document.querySelector(`[name="q${i}"]`);
        
        // Verifies presence of response according to input type
        if (input.type === "radio" || input.type === "checkbox") {
            isAnswered = document.querySelector(`input[name="q${i}"]:checked`) !== null;
        } else {
            isAnswered = input.value.trim() !== "";
        }
        
        if (!isAnswered) {
            missingQuestions.push(i);
        }
    }
    
    if (missingQuestions.length > 0) {
        validationFdbk.innerHTML = `These questions are missing answers:<br>${missingQuestions.join(", ")}`;
        validationFdbk.className = "bg-danger text-white w-100 p-2 mt-3 text-center rounded";
        return false;
    }
    
    // Extra safety to clear feedback if everything is valid
    validationFdbk.innerHTML = "";
    validationFdbk.className = "";
    
    return true;
    
}

function rightAnswer(index) {
    console.log("Attempting to update UI for question:", index);
    
    let feedback = document.querySelector(`#q${index}Feedback`);
    let img = document.querySelector(`#markImg${index}`);
    
    console.log("Feedback element found:", feedback);
    console.log("Image element found:", img);
    
    if (feedback && img) {
        feedback.innerHTML = "Correct!";
        // feedback.className = "bg-success text-white w-100 mt-2 text-center";
        feedback.className = "feedback-box feedback-correct";
        img.innerHTML = "<img src='img/checkmark_v2.svg' alt='Checkmark' class='quiz-mark'>";
        score += 10;
    } else {
        console.error(`Could not find UI elements for index ${index}.`);
    }
}

function wrongAnswer(index) {
    console.log("Attempting to update UI for question:", index);
    
    let feedback = document.querySelector(`#q${index}Feedback`);
    let img = document.querySelector(`#markImg${index}`);
    
    console.log("Feedback element found:", feedback);
    console.log("Image element found:", img);
    
    if (feedback && img) {
        feedback.innerHTML = "Incorrect!";
        // feedback.className = "bg-warning text-white w-100 mt-2 text-center";
        feedback.className = "feedback-box feedback-wrong";
        img.innerHTML = "<img src='img/xmark_v2.svg' alt='xmark' class='quiz-mark'>";
    } else {
        console.error(`Could not find UI elements for index ${index}.`);
    }
}

// Generalized function to determine if an individual answer is correct
function isCorrect(userValue, correctValue) {
    if (Array.isArray(correctValue)) { // Checks if the answer requires multiple selections
        
        if (Array.isArray(userValue)) { // Checks if user provided multiple selections
            if (userValue.length !== correctValue.length) { // If length of arrays don't match, answer can't be correct
                return false;
            }
            
            for (const val of userValue) {
                if (!correctValue.includes(val)) { // User included a value that wasn't found in answer key
                    return false;
                }
            }
            return true;
        }
        
        return correctValue.includes(userValue); // Verifies user provided correct answer if there are multiple correct options
    }
    
    return userValue === correctValue;
}

function gradeQuiz() {
    console.log("Grading quiz");
    score = 0;
    
    validationFdbk.innerHTML = "";
    // Check for no missing questions
    if (!isFormValid()) {
        return;
    }
    
    for (let i=0; i < quizKeys.length; i++) {
        
        const qName = quizKeys[i];
        const qNumber = i + 1; // User-facing question numbers are offset from quiz number index
        const config = QUIZ_SETUP[qName];
        
        let userResponse;
        const sampleInput = document.querySelector(`[name="${qName}"]`);
        
        if (sampleInput.type === "radio") {
            const checked = document.querySelector(`input[name="${qName}"]:checked`);
            userResponse = checked ? checked.value : "";
        } else if (sampleInput.type === "checkbox") {
            const checkedBoxes = document.querySelectorAll(`input[name="${qName}"]:checked`);
            userResponse = [];
            for (const cb of checkedBoxes) {
                userResponse.push(cb.value);
            }
        } else {
            userResponse = sampleInput.value.toLowerCase().trim();
        }
        
        if (isCorrect(userResponse, config.answer)) {
            rightAnswer(qNumber);
        } else {
            wrongAnswer(qNumber);
        }
    }
    
    // Displays results of quiz to user
    displayResults();
}

function displayResults() {
    
    results.classList.remove("d-none"); // Un-hides the results div
    
    if (score >= TARGET_SCORE) {
        results.className = "alert alert-success mt-4 shadow-sm";
        scoreText.innerText = `You scored: ${score}/100. Congratulations!`;  // Special congratulations if score is at least 80%
    } else {
        results.className = "alert alert-danger mt-4 shadow-sm";
        scoreText.innerText = `You scored: ${score}/100. Keep studying!`;
    }
    
    // Save result state    
    attempts++;
    attemptsText.innerText = `Total attempts: ${attempts}`;
    localStorage.setItem("total_attempts", attempts);
    localStorage.setItem("quiz_submitted", "true");
    localStorage.setItem("last_score", score);

    disableSubmitButton();
    results.scrollIntoView({
        behavior: "smooth"
    });
}

// Removes progress from local storage and clears any text input
function resetQuiz() {
    localStorage.removeItem("quiz_progress");
    localStorage.removeItem("quiz_submitted");
    localStorage.removeItem("last_score");

    quizForm.reset();

    // Clears any feedback from individual questions
    const questionCount = document.querySelectorAll(".card-body").length;
    for (let i=1; i<= questionCount; i++) {
        const feedback = document.querySelector(`#q${i}Feedback`);
        const mark = document.querySelector(`#markImg${i}`);

        if (feedback) {
            feedback.innerHTML = "";
            feedback.className = "";
        }
        if (mark) {
            mark.innerHTML = "";
        }
    }

    // Resets overall feedback and results section
    validationFdbk.innerHTML = "";
    validationFdbk.className = "";
    enableSubmitButton();
    results.classList.add("d-none");
    score = 0;

    setTimeout(function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, 10);
}

function enableSubmitButton() {
    submitBtn.disabled = false;
    submitBtn.classList.replace("btn-secondary", "btn-primary");
    submitBtn.innerText = "Submit Quiz";
    resetBtn.classList.add("invisible");
}

function disableSubmitButton() {
    submitBtn.disabled = true;
    submitBtn.classList.replace("btn-primary", "btn-secondary");
    submitBtn.innerText = "Submitted";
    resetBtn.classList.remove("invisible");
}