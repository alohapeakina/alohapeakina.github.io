//Global variables
const quizForm = document.querySelector("#test-area");

// ======== EVENT LISENTERS ========
document.querySelector("#submitBtn").addEventListener("click",testAction);

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



function testAction(e) {

    e.preventDefault();

    const q1Checked = document.querySelector('input[name="q1"]:checked');

    if (q1Checked) {
        console.log("Something happened. Intentionally even.");
        localStorage.setItem("question",q1Checked.value);
    } else {
        console.log("No answer selected for Q1");
    }

}