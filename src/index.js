import api from './api.js';



const swapButton = document.getElementById("swapButton");
const swapInfo = document.getElementById("swapInfo");

swapButton.onclick = () =>{ 
    swapButton.classList.toggle('swap-card');
    swapInfo.classList.toggle('swap-top');
}
