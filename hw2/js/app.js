//Global variables
const quizForm = document.querySelector("#test-area");
const results = document.querySelector("#results-area");
const scoreText = document.querySelector("#score-text");
const TARGET_SCORE = 80;
var score = 60;
var attempts = 0;

// ======== EVENT LISENTERS ========
document.querySelector("#submitBtn").addEventListener("click",testAction);
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
    document.querySelector(`#q${index}Feedback`).innerHTML = "Correct!";
    document.querySelector(`#q${index}Feedback`).className = "bg-success text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/checkmark.png' alt='Checkmark'>";
    score += 20;
}

function wrongAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect!";
    document.querySelector(`#q${index}Feedback`).className = "bg-warning text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/xmark.png' alt='xmark'>";
}

function gradeQuiz() {
    console.log("Grading quiz");
    document.querySelector("#validationFdbk").innerHTML = "";

    //Grading Questions
    // Grading Q5
    let q5Response = document.querySelector("input[name=q5]:checked").value;
    console.log("Q5 Response is: " + q5Response);
    // if (q5Response == "South Dakota") {
    //     document.querySelector("#q5Feedback").innerHTML = "Correct!";
    //     document.querySelector("#q5Feedback").className = "bg-success text-white";
    //     document.querySelector("#markImg5").innerHTML = "<img src='img/checkmark.png' alt='Checkmark'>";
    //     score += 20;
    // } else {
    //     document.querySelector("#q5Feedback").innerHTML = "Incorrect!";
    //     document.querySelector("#q5Feedback").className = "bg-warning text-white";
    //     document.querySelector("#markImg5").innerHTML = "<img src='img/xmark.png' alt='xmark'>";
    // }

    // Grading Q6
    let q6Response = document.querySelector("input[name=q6]:checked").value;
    console.log("Q6 Response is: " + q6Response);
    if (q6Response == "False") {
        // document.querySelector("#q6Feedback").innerHTML = "Correct!";
        // document.querySelector("#q6Feedback").className = "bg-success text-white";
        // document.querySelector("#markImg6").innerHTML = "<img src='img/checkmark.png' alt='Checkmark'>";
        // score += 20;
        rightAnswer(6)
    } else {
        // document.querySelector("#q6Feedback").innerHTML = "Incorrect!";
        // document.querySelector("#q6Feedback").className = "bg-warning text-white";
        // document.querySelector("#markImg6").innerHTML = "<img src='img/xmark.png' alt='xmark'>";
        wrongAnswer(6);
    }

    // Grading Q7
    let q7Response = document.querySelectorAll("input[name=q7]:checked");
    console.log("Q7 Responses are: " + Array.from(q7Response).map(response => response.value));
    if (document.querySelector("#q7LosAngeles").checked && document.querySelector("#q7Sacramento").checked &&
        document.querySelector("#q7SanFrancisco").checked && !document.querySelector("#q7SanDiego").checked) {
        document.querySelector("#q7Feedback").innerHTML = "Correct!";
        document.querySelector("#q7Feedback").className = "bg-success text-white";
        document.querySelector("#markImg7").innerHTML = "<img src='img/checkmark.png' alt='Checkmark'>";
        score += 20;
    } else {
        document.querySelector("#q7Feedback").innerHTML = "Incorrect!";
        document.querySelector("#q7Feedback").className = "bg-warning text-white";
        document.querySelector("#markImg7").innerHTML = "<img src='img/xmark.png' alt='xmark'>";
    }

    // Grading Q8
    let q8Response = document.querySelector("#q8a").value;
    console.log("Q8 Response is: " + q8Response);
    if (q8Response == "ak") {
        document.querySelector("#q8Feedback").innerHTML = "Correct!";
        document.querySelector("#q8Feedback").className = "bg-success text-white";
        document.querySelector("#markImg8").innerHTML = "<img src='img/checkmark.png' alt='Checkmark'>";
        score += 20;
    } else {
        document.querySelector("#q8Feedback").innerHTML = "Incorrect!";
        document.querySelector("#q8Feedback").className = "bg-warning text-white";
        document.querySelector("#markImg8").innerHTML = "<img src='img/xmark.png' alt='xmark'>";
    }

    let q9Response = document.querySelector("#q9a").value.toLowerCase();
    console.log("Q9 Response is: " + q9Response);
    if (q9Response == "delaware" || q9Response == "de") {
        document.querySelector("#q9Feedback").innerHTML = "Correct!";
        document.querySelector("#q9Feedback").className = "bg-success text-white";
        document.querySelector("#markImg9").innerHTML = "<img src='img/checkmark.png' alt='Checkmark'>";
        score += 20;
    } else {
        document.querySelector("#q9Feedback").innerHTML = "Incorrect!";
        document.querySelector("#q9Feedback").className = "bg-warning text-white";
        document.querySelector("#markImg9").innerHTML = "<img src='img/xmark.png' alt='xmark'>";
    }

    let q10Response = document.querySelector("#q10a").value;
    console.log("Q10 Response is: " + q10Response);
    if (q10Response == "6") {
        document.querySelector("#q10Feedback").innerHTML = "Correct!";
        document.querySelector("#q10Feedback").className = "bg-success text-white";
        document.querySelector("#markImg10").innerHTML = "<img src='img/checkmark.png' alt='Checkmark'>";
        score += 20;
    } else {
        document.querySelector("#q10Feedback").innerHTML = "Incorrect!";
        document.querySelector("#q10Feedback").className = "bg-warning text-white";
        document.querySelector("#markImg10").innerHTML = "<img src='img/xmark.png' alt='xmark'>";
    }


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


function testAction() {

    const q1Checked = document.querySelector('input[name="q1"]:checked');

    if (q1Checked) {
        console.log("Something happened. Intentionally even.");
        localStorage.setItem("question",q1Checked.value);
    } else {
        console.log("No answer selected for Q1");
    }

}