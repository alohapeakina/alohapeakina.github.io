// ======== GLOBAL VARIABLES ========
const quizForm = document.querySelector("#test-area");
const results = document.querySelector("#results-area");
const scoreText = document.querySelector("#score-text");
const attemptsText = document.querySelector("#total-attempts");
const validationFdbk = document.querySelector("#validationFdbk");

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
        answer: "6"
    }
}

const quizKeys = Object.keys(QUIZ_SETUP);
quizKeys.forEach(buildQuestions);

// ======== EVENT LISENTERS ========
document.querySelector("#submitBtn").addEventListener("click",gradeQuiz);
document.querySelector("#resetBtn").addEventListener("click",resetQuiz);
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
}

// Removes progress from local storage and clears any text input
function resetQuiz() {
    localStorage.removeItem("quiz_progress");
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
    results.classList.add("d-none");
    score = 0;

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
        validationFdbk.innerHTML = `These questions are missing answers: ${missingQuestions.join(", ")}`;
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
        feedback.className = "bg-success text-white w-100 mt-2 text-center";
        img.innerHTML = "<img src='img/checkmark.png' alt='Checkmark' class='quiz-mark'>";
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
        feedback.className = "bg-warning text-white w-100 mt-2 text-center";
        img.innerHTML = "<img src='img/xmark.png' alt='xmark' class='quiz-mark'>";
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

    // ========== GRADING QUESTIONS ==========

    for (let i=0; i < quizKeys.length; i++) {

        const qName = quizKeys[i];
        const qNumber = i + 1; // User-facing question numbers are offset from quiz number index
        const config = QUIZ_SETUP[qName];

        let userResponse;
        const sampleInput = document.querySelector(`[name=${qName}"]`);

        if (sampleInput.type === "radio") {
            const checked = document.querySelector(`input[name="${qName}"]:checked`);
            userResponse = checked ? checked.value : "";
        } else if (sampleInput.type === "checkbox") {
            const checkedBoxes = document.querySelectorAll(`input[name=${qName}"]:checked`);
            userResponse = [];
            for (const cb of checkedBoxes) {
                userResponse.push(cb.value);
            }
        } else {
            userResponse = sampleInput.value.toLowerCase().trim();
        }

        if (isCorrect(userResponse.config.answer)) {
            rightAnswer(qNumber);
        } else {
            wrongAnswer(qNumber);
        }
    }

    // Grading Q1
    // let q1Response = document.querySelector("input[name=q1]:checked").value;
    // console.log("Q1 Response is: " + q1Response);
    // if (q1Response == "southdakota") {
    //     rightAnswer(1);
    // } else {
    //     wrongAnswer(1);
    // }

    // // Grading Q2
    // let q2Response = document.querySelector("input[name=q2]:checked").value;
    // console.log("Q2 Response is: " + q2Response);
    // if (q2Response == "arizona") {
    //     rightAnswer(2);
    // } else {
    //     wrongAnswer(2);
    // }

    // // Grading Q3
    // let q3Response = document.querySelector("input[name=q3]:checked").value;
    // console.log("Q3 Response is: " + q3Response);
    // if (q3Response == "missouri") {
    //     rightAnswer(3);
    // } else {
    //     wrongAnswer(3);
    // }

    // // Grading Q4
    // let q4Response = document.querySelector("input[name=q4]:checked").value;
    // console.log("Q4 Response is: " + q4Response);
    // if (q4Response == "superior") {
    //     rightAnswer(4);
    // } else {
    //     wrongAnswer(4);
    // }

    // // Grading Q5
    // let q5Response = document.querySelector("input[name=q5]:checked").value;
    // console.log("Q5 Response is: " + q5Response);
    // if (q5Response == "kauai") {
    //     rightAnswer(5);
    // } else {
    //     wrongAnswer(5);
    // }

    // // Grading Q6
    // let q6Response = document.querySelector("input[name=q6]:checked").value;
    // console.log("Q6 Response is: " + q6Response);
    // if (q6Response == "false") {
    //     rightAnswer(6)
    // } else {
    //     wrongAnswer(6);
    // }

    // // Grading Q7
    // let q7Response = document.querySelectorAll("input[name=q7]:checked");
    // console.log("Q7 Responses are: " + Array.from(q7Response).map(response => response.value));
    // if (document.querySelector("#q7LosAngeles").checked && document.querySelector("#q7Sacramento").checked &&
    //     document.querySelector("#q7SanFrancisco").checked && !document.querySelector("#q7SanDiego").checked) {
    //     rightAnswer(7);
    // } else {
    //     wrongAnswer(7);
    // }

    // // Grading Q8
    // let q8Response = document.querySelector("#q8a").value;
    // console.log("Q8 Response is: " + q8Response);
    // if (q8Response == "ak") {
    //     rightAnswer(8);
    // } else {
    //     wrongAnswer(8);
    // }

    // let q9Response = document.querySelector("#q9a").value.toLowerCase();
    // console.log("Q9 Response is: " + q9Response);
    // if (q9Response == "delaware" || q9Response == "de") {
    //     rightAnswer(9);
    // } else {
    //     wrongAnswer(9);
    // }

    // let q10Response = document.querySelector("#q10a").value;
    // console.log("Q10 Response is: " + q10Response);
    // if (q10Response == "6") {
    //     rightAnswer(10);
    // } else {
    //     wrongAnswer(10);
    // }

    // ========== END OF GRADING QUESTIONS ==========

    // Displays results of quiz to user
    displayResults();
}

function displayResults() {

    results.classList.remove("d-none"); // Un-hides the results div

    if (score >= TARGET_SCORE) {
        results.className = "alert alert-success mt-4";
        scoreText.innerText = `You scored: ${score}/100. Congratulations!`;  // Special congratulations if score is at least 80%
    } else {
        results.className = "alert alert-danger mt-4";
        scoreText.innerText = `You scored: ${score}/100.`;
    }
    
    attemptsText.innerText = `Total attempts: ${++attempts}`;
    localStorage.setItem("total_attempts", attempts);
    
    document.querySelector("#results-area").scrollIntoView();
    
}