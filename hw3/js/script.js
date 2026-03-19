const API_KEY = "live_graOEO8qMpWq0zl5kBf1uCipTncPfv0auX0H3oPmwgEyXZhndKkP9wU14KfJ4W64";
const BASE_URL = "https://api.thedogapi.com/v1/";

async function dogApiRequest(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`,
        {headers: { "x-api-key": API_KEY}});
    return await response.json();
}

async function fetchBreeds() {
    return await dogApiRequest("/breeds");
}

async function fetchDogByBreed(breedId) {
    return await dogApiRequest(`/images/search?breed_ids=${breedId}`);
}