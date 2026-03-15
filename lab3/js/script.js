//Global variables
let usernameAvailable = false;
const STATES = {
    ca: "California",

}

//Event Listeners
document.querySelector("#zip").addEventListener("change",displayCity);
document.querySelector("#state").addEventListener("change",displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#signupForm").addEventListener("submit",function(event) {
    validateForm(event);
});

//Functions

//Displaying City from Web API after entering zip code
async function displayCity() {
    let zipCode = document.querySelector("#zip").value;
    // console.log(zipCode);
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
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
    let username = document.querySelector("#username").value;
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

//Validating form data
function validateForm(e) {
    let isValid = true;
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    console.log("Password value is: " + password);

    let usernameError = document.querySelector("#usernameError");
    let passwordError = document.querySelector("#passwordError");

    // Clear previous messages
    usernameError.textContent = "";
    passwordError.textContent = "";

    if (username.length === 0) {
        usernameError.textContent = "Username Required!";
        usernameError.style.color = "red";
        isValid = false;
    } else if (!usernameAvailable) {
        usernameError.textContent = "Username is taken!";
        usernameError.style.color = "red";
         isValid = false;
    }

    if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters";
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
    }
}