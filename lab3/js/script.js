//Global variables
let usernameAvailable = false;
const REQUIRED_PWD_LENGTH = 6;
const passwordField = document.querySelector("#password");
const usernameField = document.querySelector("#username");
const passwordCheckField = document.querySelector("#passwordCheck");

//Event Listeners
document.querySelector("#zip").addEventListener("change",displayCity);
document.querySelector("#state").addEventListener("change",displayCounties);
usernameField.addEventListener("change", checkUsername);
passwordField.addEventListener("click",suggestPassword);
window.addEventListener("load",getStates);
document.querySelector("#signupForm").addEventListener("submit",function(event) {
    validateForm(event);
});

//Functions

//Displays list of states from Web API
async function getStates() {
    let url = `https://csumb.space/api/allStatesAPI.php`;
    let response = await fetch(url);
    let data = await response.json();
    let stateList = document.querySelector("#state");
    stateList.innerHTML ="<option>Select a State</option>";
    for (let i=0; i < data.length; i++) {
        stateList.innerHTML += `<option value="${data[i].usps}"> ${data[i].state} </option>`;
    }
}

//Displaying City from Web API after entering zip code
async function displayCity() {
    let zipCode = document.querySelector("#zip").value;
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();
    document.querySelector("#city").innerHTML = data.city;
    document.querySelector("#latitude").innerHTML = data.latitude;
    document.querySelector("#longitude").innerHTML = data.longitude;
}

//Displaying counties from Web API based on the two-letter abbreviation of a state
async function displayCounties() {
    let state = document.querySelector("#state").value;
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();
    let countyList = document.querySelector("#county");
    countyList.innerHTML ="<option>Select County</option>";
    for (let i=0; i < data.length; i++) {
        countyList.innerHTML += `<option> ${data[i].county} </option>`;
    }
}

//Checks if username is available
async function checkUsername() {
    let username = usernameField.value;
    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();
    let usernameError = document.querySelector("#usernameError");

    if (data.available) {
        usernameError.innerHTML = "Username available!";
        usernameError.style.color = "green";
        usernameAvailable = true;
    }
    else {
        usernameError.innerHTML = "Username taken";
        usernameError.style.color = "red";
        usernameAvailable = false;
    }
}

async function suggestPassword() {
    let password = passwordField.value;
    let url = `https://csumb.space/api/suggestedPassword.php?length=${REQUIRED_PWD_LENGTH}`;
    let response = await fetch(url);
    let data = await response.json();
    let suggestedPwd = document.querySelector("#suggestedPwd");
    if (data.available) {
        suggestedPwd.innerHTML = "No suggestions available";
    } else {
        suggestedPwd.innerHTML = "Suggested Password: " + data.password;
    }
}

//Validating form data
function validateForm(e) {
    let isValid = true;
    let username = usernameField.value;
    let password = passwordField.value;
    let passwordCheck = passwordCheckField.value;
    let usernameError = document.querySelector("#usernameError");
    let passwordError = document.querySelector("#passwordError");

    // Clear previous messages
    usernameError.innerHTML = "";
    passwordError.innerHTML = "";

    // Validates username
    if (username.length === 0) {
        usernameError.innerHTML = "Username Required!";
        usernameError.style.color = "red";
        isValid = false;
    } else if (!usernameAvailable) {
        usernameError.innerHTML = "Username is taken!";
        usernameError.style.color = "red";
         isValid = false;
    }

    // Validates pasword
    if (password.length < 6) {
        passwordError.innerHTML = "Password must be at least 6 characters <br>";
        passwordError.style.color = "red";
        isValid = false;
    }

    if (password !== passwordCheck) {
        passwordError.innerHTML += "Passwords do not match";
        passwordError.style.color = "red";
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
    }
}