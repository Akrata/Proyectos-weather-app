const API_KEY = "edbd7f5332b0eacf66210e464485e33b";
let place = "Las piedras"
let api = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${API_KEY}`


const fetchDataLatLon = async(latitude, longitude) => {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
        // const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${API_KEY}`);
        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

const success = (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    fetchDataLatLon(latitude, longitude);
}

navigator.geolocation.getCurrentPosition(success);

const swapButton = document.getElementById("swapButton");
const swapInfo = document.getElementById("swapInfo");

swapButton.onclick = async() =>{ 
    swapButton.classList.toggle('swap-card');
    swapInfo.classList.toggle('swap-top');
}