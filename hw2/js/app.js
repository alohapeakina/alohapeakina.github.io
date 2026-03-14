//Global variables
const quizForm = document.querySelector("#test-area");
const results = document.querySelector("#results-area");
const scoreText = document.querySelector("#score-text");
const TARGET_SCORE = 80;
const score = 60;

// ======== EVENT LISENTERS ========
document.querySelector("#submitBtn").addEventListener("click",testAction);
document.querySelector("#submitBtn").addEventListener("click",gradeQuiz);

// Saves progress to local storage
quizForm.addEventListener("change", () => {
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
});

// Restores progress/answers on a page load
window.addEventListener("load", () => {
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
});

function isFormValid() {
    let isValid = true;

    if (document.getElementsByName('input[name="q1"]:checked').value == null ) {
        isValid=false;
        document.querySelector("#validationFdbk").innerHTML = "Question 1 was not answered";
    }

    return isValid;
}

function gradeQuiz() {
    console.log("Grading quiz");
    document.querySelector("#validationFdbk").innerHTML = "";
    if (!isFormValid()) {
        return;
    }
    console.log("I made it past the grading return");
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