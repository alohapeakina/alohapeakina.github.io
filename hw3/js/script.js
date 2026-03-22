// ====== CONSTANTS ======
const dogSection = document.getElementById("dogSection");
const catSection = document.getElementById("catSection");
const woofToggle = document.getElementById("woofMode");
const meowToggle = document.getElementById("meowMode");

// ====== EVENT LISTENERS ======
document.getElementById("randomDogFacts").addEventListener("click", () => {
    const limit = document.getElementById("dogFactLimit").value;
    getRandomDogFacts(limit);
});
document.getElementById("randomCatFacts").addEventListener("click", () => {
    const limit = document.getElementById("catFactLimit").value;
    getRandomCatFacts(limit);
});
document.getElementById("getDogImage").addEventListener("click",getDogImage);
document.getElementById("getCatImage").addEventListener("click",getCatImage);
woofToggle.addEventListener("change",switchMode);
meowToggle.addEventListener("change",switchMode);

switchMode(); // This is called here to ensure the toggle maintains state with the page

//====== FUNCTIONS ======

function switchMode() {
    // Clears fact input and resets placeholders when switching modes
    document.getElementById("dogFactLimit").value = "";
    document.getElementById("catFactLimit").value = "";
    document.getElementById("dog-fact-list").innerHTML = 
        '<li class="fact-placeholder">Click the button to get up to 5 dog facts!</li>';
    document.getElementById("cat-fact-list").innerHTML = 
        '<li class="fact-placeholder">Click the button to get up to 5 cat facts!</li>';

    if (woofToggle.checked) {
        dogSection.classList.remove("d-none");
        catSection.classList.add("d-none");

        document.body.classList.add("theme-dog");
        document.body.classList.remove("theme-cat");

    } else if (meowToggle.checked) {
        dogSection.classList.add("d-none");
        catSection.classList.remove("d-none");

        document.body.classList.add("theme-cat");
        document.body.classList.remove("theme-dog");
    }
}

async function getDogImage() {
    const dogImgElement = document.getElementById("dogImage");

    try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const json = await response.json();
    
        if (json.status === "success") {
            dogImgElement.src = json.message;
            dogImgElement.style.display = "block";

        } else {
            console.error("Failed to fetch image");
        }
    } catch(error) {
        console.error("Network error: ", error);
    }
}

async function getCatImage() {

    const catImgElement = document.getElementById("catImage");

    // Uses JSON format as simple implementation to ensure a new image is generated every time the function is called
    try {
        const response = await fetch("https://cataas.com/cat?position=center&json=true");
        const json = await response.json();

        catImgElement.src = json.url;
        catImgElement.style.display = "block";
    
    } catch(error) {
        console.error("Network error: ", error);
    }
}

async function getRandomDogFacts(limit) {

    const factField = document.getElementById("dog-fact-list");
    const inputField = document.getElementById("dogFactLimit");

    if (limit <= 0 || limit > 5 || !limit) {
        inputField.classList.add("is-invalid");
        return;
    } else {
        inputField.classList.remove("is-invalid");
    }

    factField.innerHTML = "Fetchest goodest bois"; // Flavor text while retrieving API info
    
    try {
        const response = await fetch(`https://dogapi.dog/api/v2/facts?limit=${limit}`);
        const json = await response.json();

        factField.innerHTML = ""; // Clears placeholder text

        for (let i = 0; i < limit; i++) {
            factField.innerHTML += `<li>${json.data[i].attributes.body}</li>`;
        }

    } catch (error) {
        console.error("Fetch error:", error);
        factField.textContent = "[Failed to get fact]";
    }
}

async function getRandomCatFacts(limit) {

    const factField = document.getElementById("cat-fact-list");
    const inputField = document.getElementById("catFactLimit");
    
    if (limit <= 0 || limit > 5 || !limit) {
        inputField.classList.add("is-invalid");
        return;
    } else {
        inputField.classList.remove("is-invalid");
    }

    // Clears previous facts and prepares for new ones
    factField.innerHTML = "<li>Gathering fresh cat wisdom...</li>";
    
    try {
        const responses = [];

        for (let i = 0; i < limit; i++) {
            responses.push(fetch("https://catfact.ninja/fact").then(res => res.json()));
        }

        const results = await Promise.all(responses);
        const factList = results.map(item => `<li>${item.fact}</li>`).join("");

        factField.innerHTML = factList;

    } catch (error) {
        console.error("Fetch error:", error);
        factField.innerHTML = "<li>[Failed to get facts]</li>";
    }
}