// ====== API INFO ======
const API_KEY = "live_graOEO8qMpWq0zl5kBf1uCipTncPfv0auX0H3oPmwgEyXZhndKkP9wU14KfJ4W64";
const BASE_URL = "https://api.thedogapi.com/v1";

// ====== EVENT LISTENERS ======
document.getElementById("randomDogFact").addEventListener("click", () => {
    const limit = document.getElementById("dogFactLimit").value;
    getRandomDogFacts(limit);
});
document.getElementById("randomCatFacts").addEventListener("click", () => {
    const limit = document.getElementById("catFactLimit").value;
    getRandomCatFacts(limit);
});
document.getElementById("getDogImage").addEventListener("click",getDogImage);
document.getElementById("getCatImage").addEventListener("click",getCatImage);



//====== FUNCTIONS ======

async function dogApiRequest(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "x-api-key": API_KEY
        }
    });
    return await response;
}

async function getBreeds() {
    return await dogApiRequest("/breeds");
}


async function getDogImage() {
    const dogImgElement = document.getElementById("dogImage");
    const dogCaption = document.getElementById("breedCaption");

    try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const json = await response.json();
    
        if (json.status === "success") {
            dogImgElement.src = json.message;

            const responseSplit = json.message.split("/");
            const breedName = responseSplit[4].replace("-", " ");

            dogCaption.innerText= `Breed: ${breedName}`;

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
        const response = await fetch("https://cataas.com/cat?position=center&width=300&json=true");
        const json = await response.json();

        catImgElement.src = json.url;
    
    } catch(error) {
        console.error("Network error: ", error);
    }
    
}

// TODO: Add loading text when facts are loading
async function getRandomDogFacts(limit) {

    const factField = document.getElementById("dog-fact-list");
    const inputField = document.getElementById("dogFactLimit");

    if (limit <= 0 || limit > 5 || !limit) {
        inputField.classList.add("is-invalid");
        return;
    } else {
        inputField.classList.remove("is-invalid");
    }


    factField.innerHTML = "";
    
    try {
        const response = await fetch(`https://dogapi.dog/api/v2/facts?limit=${limit}`);
        const json = await response.json();

        for (let i = 0; i < limit; i++) {
            factField.innerHTML += `<li>${json.data[i].attributes.body}</li>`;
        }


    } catch (error) {
        console.error("Fetch error:", error);
        factField.textContent = "[Failed to get fact]";
    }
}

//TODO: Add error validation
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
    factField.innerHTML = "<li>Preparing facts!</li>";
    
    try {
        const response = await fetch(`https://catfact.ninja/facts?limit=${limit}`);
        const json = await response.json();
        const factArray = json.data;

        const factList = factArray.map(item => `<li>${item.fact}</li>`).join("");

        factField.innerHTML = factList;


    } catch (error) {
        console.error("Fetch error:", error);
        factField.innerHTML = "<li>[Failed to get facts]</li>";
    }
}