const API_KEY = "live_graOEO8qMpWq0zl5kBf1uCipTncPfv0auX0H3oPmwgEyXZhndKkP9wU14KfJ4W64";
const BASE_URL = "https://api.thedogapi.com/v1";

async function dogApiRequest(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`,
        {headers: { "x-api-key": API_KEY}});
    return await response.json();
}

//Full list of all dog breeds
async function fetchBreeds() {
    return await dogApiRequest("/breeds");
}

// Random dog photos
async function fetchDogImage(breedId) {
    return await dogApiRequest(`/images/search?breed_ids=${breedId}`);
}

async function fetchDogByBreed(name) {
    return await dogApiRequest(`/breeds/search?q=${name}`);
}

// Uses free API that doesn't need a key
async function fetchRandomFact() {
    const factField = document.getElementById("fact-text");
    
    try {
    const response = await fetch("https://dogapi.dog/api/v2/facts?limit=1");
    const json = await response.json();
    const factBody = json.data[0].attributes.body;

    factField.textContent = factBody;


  } catch (error) {
    console.error("Fetch error:", error);
    factField.textContent = "[Failed to get fact]";
  }
}