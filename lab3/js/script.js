//Event Listeners
document.querySelector("#zip").addEventListener("change",displayCity);

//Functions

//Displaying City from Web API after entering zip code
async function displayCity() {
    let zipCode = document.querySelector("#zip").value;
    // console.log(zipCode);
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
}