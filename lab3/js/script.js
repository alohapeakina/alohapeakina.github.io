//Global variables
let usernameAvailable = false;
let validZip = false;
const REQUIRED_PWD_LENGTH = 6;
const passwordField = document.querySelector("#password");
const usernameField = document.querySelector("#username");
const passwordCheckField = document.querySelector("#passwordCheck");
const zipCodeField = document.querySelector("#zip");

//Event Listeners
zipCodeField.addEventListener("change",displayCity);
document.querySelector("#state").addEventListener("change",displayCounties);
usernameField.addEventListener("change", checkUsername);
passwordField.addEventListener("click",suggestPassword);
window.addEventListener("load",getStateList);
document.querySelector("#signupForm").addEventListener("submit",function(event) {
    validateForm(event);
});

//Functions

//Displays list of states from Web API
async function getStateList() {
    let url = `https://csumb.space/api/allStatesAPI.php`;
    let response = await fetch(url);
    let data = await response.json();
    // let data = getZip();
    let stateList = document.querySelector("#state");
    stateList.innerHTML ="<option>Select a State</option>";
    for (let i=0; i < data.length; i++) {
        stateList.innerHTML += `<option value="${data[i].usps}"> ${data[i].state} </option>`;
    }
}

//Displaying City from Web API after entering zip code
async function displayCity() {
    let data = await getZip();
    if (data) {
        document.querySelector("#city").innerHTML = data.city;
        document.querySelector("#latitude").innerHTML = data.latitude;
        document.querySelector("#longitude").innerHTML = data.longitude;
    } else {
        document.querySelector("#city").innerHTML = "";
        document.querySelector("#latitude").innerHTML = "";
        document.querySelector("#longitude").innerHTML = "";
    }
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
    
    // Clears error field if no data to check
    if (username.length === 0) {
        usernameField.classList.remove("is-valid");
        usernameField.classList.remove("is-invalid");
        return;
    }
    
    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);

    if (data.available) {
        usernameField.classList.remove("is-invalid");
        usernameField.classList.add("is-valid");
        usernameAvailable = true;
    }
    else {
        usernameField.classList.remove("is-valid");
        usernameField.classList.add("is-invalid");
        usernameAvailable = false;
    }
}

async function suggestPassword() {
    let password = passwordField.value;
    let url = `https://csumb.space/api/suggestedPassword.php?length=${REQUIRED_PWD_LENGTH}`;
    let response = await fetch(url);
    let data = await response.json();
    let suggestedPwd = document.querySelector("#suggestedPwd");
    if (data.password) {
        suggestedPwd.innerHTML = "Suggested Password: " + data.password;
    } else {
        suggestedPwd.innerHTML = "No suggestions available";
    }
}

async function getZip() {

    let zipCode = zipCodeField.value;
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();

    if (!data || data ===false) {
        zipCodeField.classList.add("is-invalid");
        validZip = false;
        return false;
    } else {
        zipCodeField.classList.remove("is-invalid");
        validZip = true;
        return data;
    }

}

//Validating form data
function validateForm(e) {
    let isValid = true;
    let username = usernameField.value;
    let password = passwordField.value;
    let passwordCheck = passwordCheckField.value;

    // Clear previous messages
    usernameField.classList.remove("is-invalid","is-valid");
    passwordField.classList.remove("is-invalid","is-valid");
    passwordCheckField.classList.remove("is-invalid","is-valid");


    // Validates zip code
    if (validZip == false) {
        isValid = false;
    }

    // Validates username
    if (username.length === 0 || !usernameAvailable) {
        usernameField.classList.add("is-invalid");
        isValid = false;
    }  else {
        usernameField.classList.add("is-valid");
    }

    // Validates pasword
    if (password.length < 6) {
        passwordField.classList.add("is-invalid");
        isValid = false;
    }

    if (password !== passwordCheck) {
        passwordCheckField.classList.add("is-invalid");
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
    }
}