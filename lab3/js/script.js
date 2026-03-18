// ====== GLOBAL VARIABLES ======
let usernameAvailable = false;
let validZip = false;
const REQUIRED_PWD_LENGTH = 6;
const fNameField = document.querySelector("#fName");
const lNameField = document.querySelector("#lName");
const passwordField = document.querySelector("#password");
const usernameField = document.querySelector("#username");
const passwordCheckField = document.querySelector("#passwordCheck");
const zipCodeField = document.querySelector("#zip");

// ====== EVENT LISTENERS ======
zipCodeField.addEventListener("change",displayCity);
document.querySelector("#state").addEventListener("change",displayCounties);
usernameField.addEventListener("change", checkUsername);
passwordField.addEventListener("click",suggestPassword);
window.addEventListener("load",getStateList);
document.querySelector("#signupForm").addEventListener("submit",function(event) {
    validateForm(event);
});

// ====== FUNCTIONS ======

//Displays list of states from Web API
async function getStateList() {
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
    let data = await getZip();
    if (data) {
        document.querySelector("#city").value = data.city;
        document.querySelector("#latitude").value = data.latitude;
        document.querySelector("#longitude").value = data.longitude;
    } else {
        document.querySelector("#city").value = "";
        document.querySelector("#latitude").value = "";
        document.querySelector("#longitude").value = "";
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
    let usernameErrorField = document.querySelector("#usernameError");
    let usernameSuccessField = document.querySelector("#usernameSuccess");
    
    // Resets to default if no username is entered
    if (username.length === 0) {
        usernameField.classList.remove("is-valid", "is-invalid");
        usernameErrorField.innerHTML = "Username is required";
        usernameSuccessField.innerHTML = "Username is available!"
        usernameAvailable = false;
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
        usernameErrorField.innerHTML = "Username is taken";
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
    let invalidZip = document.querySelector("#invalidZip");

    // Removes validation text if zip field is empty
    if (zipCode.length === 0) {
        zipCodeField.classList.remove("is-valid", "is-invalid");
        validZip = false;
        return;
    }

    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();


    if (!data || data === false) {
        zipCodeField.classList.remove("is-valid");
        zipCodeField.classList.add("is-invalid");
        invalidZip.innerHTML = "Please enter a valid zip";
        validZip = false;
        return false;
    } else {
        zipCodeField.classList.remove("is-invalid");
        zipCodeField.classList.add("is-valid");
        invalidZip.innerHTML = "";
        validZip = true;
        return data;
    }

}

//Validating form data
function validateForm(e) {
    let isValid = true;
    let fName = fNameField.value;
    let lName = lNameField.value;
    let username = usernameField.value;
    let password = passwordField.value;
    let passwordCheck = passwordCheckField.value;
    let usernameErrorField = document.querySelector("#usernameError");
    let invalidZip = document.querySelector("#invalidZip");

    // Clear previous messages
    passwordField.classList.remove("is-invalid","is-valid");
    passwordCheckField.classList.remove("is-invalid","is-valid");
    zipCodeField.classList.remove("is-invalid");

    // Verifies name is not empty
    if (fName === "") {
        fNameField.classList.remove("is-valid");
        fNameField.classList.add("is-invalid");
        isValid = false;
    } else {
        fNameField.classList.remove("is-invalid");
        fNameField.classList.add("is-valid");
    }

    if (lName === "") {
        lNameField.classList.remove("is-valid");
        lNameField.classList.add("is-invalid");
        isValid = false;
    } else {
        lNameField.classList.remove("is-invalid");
        lNameField.classList.add("is-valid");
    }


    // Zip code validation
    if (zipCodeField.value.trim() === "") {
        zipCodeField.classList.add("is-invalid");
        zipCodeField.classList.remove("is-valid");
        invalidZip.innerHTML = "Zip code is required";
        isValid = false;
    } else if (!validZip) {
        isValid = false;
    } else {
        zipCodeField.classList.add("is-valid");
    }

    // Username validation
    if (username.length === 0) {
        usernameField.classList.add("is-invalid");
        usernameErrorField.innerHTML = "Username is required";
        isValid = false;
    } else if (!usernameAvailable) {
        usernameField.classList.add("is-invalid");
        usernameErrorField.innerHTML = "Username is taken";
        isValid = false;
    } 
    else {
        usernameField.classList.remove("is-invalid");
        usernameField.classList.add("is-valid");
    }

    // Password Validation
    if (password.length < REQUIRED_PWD_LENGTH) {
        passwordField.classList.add("is-invalid");
        isValid = false;
    } else {
        passwordField.classList.add("is-valid");
    }

    if (password !== passwordCheck || passwordCheck.length === 0) {
        passwordCheckField.classList.add("is-invalid");
        isValid = false;
    } else {
        passwordCheckField.classList.add("is-valid");
    }

    // Submits form if valid
    if (!isValid) {
        e.preventDefault();
    }
}