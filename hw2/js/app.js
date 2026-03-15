//Global variables
const quizForm = document.querySelector("#test-area");
const results = document.querySelector("#results-area");
const scoreText = document.querySelector("#score-text");
const TARGET_SCORE = 80;
var score = 0;
var attempts = 0;

// ======== EVENT LISENTERS ========
// document.querySelector("#submitBtn").addEventListener("click",testAction);
document.querySelector("#submitBtn").addEventListener("click",gradeQuiz);
quizForm.addEventListener("change",saveProgress);
window.addEventListener("load", loadProgress);

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
// TODO: Review splitting quiz loading, which would require rendering refactor
function loadProgress() {
    const savedResponses = JSON.parse(localStorage.getItem("quiz_progress"));

    if (savedResponses) {
        Object.keys(savedResponses).forEach(question => {
            const val = savedResponses[question];
            const input = document.querySelectorAll(`[name="${question}"]`);

            input.forEach(input => {
                if (Array.isArray(val)) {
                    if (val.includes(input.value)) input.checked = true;
                } else {
                    if (input.value ===val) input.checked = true;
                }
            });
        });
    }
}

// Verifies all quiz questions have been answered
function isFormValid() {
    let isValid = false;
    
    if (document.querySelector('input[name="q1"]:checked')) {
        isValid=true;
        console.log("isValid value (early return) = " + isValid)
        return isValid;
    }
    
    document.querySelector("#validationFdbk").innerHTML = "Question 1 was not answered";
    console.log("isValid value (escaped) = " + isValid)
    return isValid;
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

function gradeQuiz() {
    console.log("Grading quiz");
    document.querySelector("#validationFdbk").innerHTML = "";

    // ========== GRADING QUESTIONS ==========

    // Grading Q1
    let q1Response = document.querySelector("input[name=q1]:checked").value;
    console.log("Q1 Response is: " + q1Response);
    if (q1Response == "South Dakota") {
        rightAnswer(1);
    } else {
        wrongAnswer(1);
    }

    // Grading Q2
    let q2Response = document.querySelector("input[name=q2]:checked").value;
    console.log("Q2 Response is: " + q2Response);
    if (q2Response == "arizona") {
        rightAnswer(2);
    } else {
        wrongAnswer(2);
    }

    // Grading Q3
    let q3Response = document.querySelector("input[name=q3]:checked").value;
    console.log("Q3 Response is: " + q3Response);
    if (q3Response == "missouri") {
        rightAnswer(3);
    } else {
        wrongAnswer(3);
    }

    // Grading Q4
    let q4Response = document.querySelector("input[name=q4]:checked").value;
    console.log("Q4 Response is: " + q4Response);
    if (q4Response == "superior") {
        rightAnswer(4);
    } else {
        wrongAnswer(4);
    }

    // Grading Q5
    let q5Response = document.querySelector("input[name=q5]:checked").value;
    console.log("Q5 Response is: " + q5Response);
    if (q5Response == "kauai") {
        rightAnswer(5);
    } else {
        wrongAnswer(5);
    }

    // Grading Q6
    let q6Response = document.querySelector("input[name=q6]:checked").value;
    console.log("Q6 Response is: " + q6Response);
    if (q6Response == "false") {
        rightAnswer(6)
    } else {
        wrongAnswer(6);
    }

    // Grading Q7
    let q7Response = document.querySelectorAll("input[name=q7]:checked");
    console.log("Q7 Responses are: " + Array.from(q7Response).map(response => response.value));
    if (document.querySelector("#q7LosAngeles").checked && document.querySelector("#q7Sacramento").checked &&
        document.querySelector("#q7SanFrancisco").checked && !document.querySelector("#q7SanDiego").checked) {
        rightAnswer(7);
    } else {
        wrongAnswer(7);
    }

    // Grading Q8
    let q8Response = document.querySelector("#q8a").value;
    console.log("Q8 Response is: " + q8Response);
    if (q8Response == "ak") {
        rightAnswer(8);
    } else {
        wrongAnswer(8);
    }

    let q9Response = document.querySelector("#q9a").value.toLowerCase();
    console.log("Q9 Response is: " + q9Response);
    if (q9Response == "delaware" || q9Response == "de") {
        rightAnswer(9);
    } else {
        wrongAnswer(9);
    }

    let q10Response = document.querySelector("#q10a").value;
    console.log("Q10 Response is: " + q10Response);
    if (q10Response == "6") {
        rightAnswer(10);
    } else {
        wrongAnswer(10);
    }

    // ========== END OF GRADING QUESTIONS ==========


    // Check for no missing questions
    if (!isFormValid()) {
        return;
    }
    console.log("I made it past the grading return");

    // Displays results
    results.classList.remove("d-none"); // Un-hides the results div
    if (score >= 80) {
        results.classList.replace("alert-primary","alert-success");
        scoreText.innerText = `You scored: ${score}/100. Congratulations!`;  // Special congratulations if score is at least 80%
    } else {
        scoreText.innerText = `You scored: ${score}/100.`;
    }
}


// function testAction() {

//     const q1Checked = document.querySelector('input[name="q1"]:checked');

//     if (q1Checked) {
//         console.log("Something happened. Intentionally even.");
//         localStorage.setItem("question",q1Checked.value);
//     } else {
//         console.log("No answer selected for Q1");
//     }

// }