const API_KEY = "edbd7f5332b0eacf66210e464485e33b";
let api = ``;

let clima = {
    soleado: "./icons/Sun.svg",
    nublado: "./icons/Cloud.svg",
    lluvia: "./icons/Cloud-drizzle.svg",
    tormenta: "./icons/Cloud-lightning.svg",
};
let weatherHourTomorrow = [];
let weatherDays = [];
let weatherHour = [];

let diasSemana2 = new Array(
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
);
let fecha = new Date();

const fetchDataLatLon = async (latitude, longitude) => {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
        );
        // const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${API_KEY}`);
        const data = await res.json();
        console.log(data);
        // for (let i = 0; i<= data.daily.length; i++)
        const weatherToday = {
            lugar: data.timezone.slice(quitarBarra(data.timezone)),
            temp: floorTemp(data.current.temp),
            max: floorTemp(data.daily[0].temp.max),
            min: floorTemp(data.daily[0].temp.min),
            humedad: data.current.humidity,
            viento: data.current.wind_speed,
            estado: data.current.weather[0].main,
        };

        let hora = obtenerHora();
        for (let i = 0; i < 24 - obtenerHora(); i++) {
            let item = {
                temp: floorTemp(data.hourly[i].temp),
                desc: data.hourly[i].weather[0].main,
                hora: `${hora}:00`,
            };
            hora += 1;

            weatherHour.push(item);
        }
        //logica Tomorrow

        for (let i = 24 - obtenerHora(); i < 48 - obtenerHora(); i++) {
            let item = {
                temp: floorTemp(data.hourly[i].temp),
                desc: data.hourly[i].weather[0].main,
                hora: `${hora - 24}:00`,
            };
            hora += 1;

            weatherHourTomorrow.push(item);
        }
        console.log(weatherHourTomorrow);
        //LOGICA DE SEMANA

        for (let i = 0; i < data.daily.length; i++) {
            let item = {
                temp: floorTemp(data.daily[i].temp.day),
                desc: data.daily[i].weather[0].main,
                dia: diasSemana2[fecha.getDay() + i],
            };
            console.log(diasSemana2[fecha.getDay() + i]);
            weatherDays.push(item);
        }

        console.log(weatherDays);
        pintarIndividual(weatherHour);
        pintarCard(weatherToday);
    } catch (error) {
        console.log(error);
    }
};
const floorTemp = (temp) => {
    return `${Math.floor(temp)}°`;
};
const quitarBarra = (string) => {
    const res = string.indexOf("/");
    return res + 1;
};
const obtenerHora = () => {
    let hoy = new Date();
    let hora = hoy.getHours();
    return hora;
};
const obtenerDia = () => {
    let diasSemana = new Array(
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
    );
    let f = new Date();
    return diasSemana[f.getDay()];
};

const obtenerFecha = () => {
    let meses = new Array(
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    );
    let diasSemana = new Array(
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
    );
    let f = new Date();
    return (
        diasSemana[f.getDay()] +
        ", " +
        f.getDate() +
        " de " +
        meses[f.getMonth()]
    );
};

const success = (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    fetchDataLatLon(latitude, longitude);
};

navigator.geolocation.getCurrentPosition(success);

const pintarCard = (weatherToday) => {
    console.log(weatherToday);
    const container = document.getElementById("container");
    const temperature = (document.getElementById("temperature").innerText =
        weatherToday.temp);
    const city = (document.getElementById(
        "city"
    ).innerHtml = `<img src="./icons/Property 1=map-pin.svg" alt="">${weatherToday.lugar}`);
    const fecha = (document.getElementById("fecha").innerText = obtenerFecha());
    const max = (document.getElementById(
        "max"
    ).innerText = ` ${weatherToday.max}`);
    const min = (document.getElementById(
        "min"
    ).innerText = ` ${weatherToday.min}`);
    const viento = (document.getElementById(
        "viento"
    ).innerText = ` ${weatherToday.viento} Km/H`);
    const humedad = (document.getElementById(
        "humedad"
    ).innerText = ` ${weatherToday.humedad} %`);

    // Rain, Clear, Clouds
    switch (weatherToday.estado) {
        case "Rain":
            if (obtenerHora() > 7 && obtenerHora() < 19) {
                container.style.backgroundImage =
                    "url('./images/lluvioso.jpg')";
                break;
            } else {
                container.style.backgroundImage =
                    "url('./images/noche-lluvioso.jpg')";
            }
        case "Clear":
            if (obtenerHora() > 7 && obtenerHora() < 19) {
                container.style.backgroundImage = "url('./images/soleado.jpg')";
                break;
            } else {
                container.style.backgroundImage =
                    "url('../images/noche-despejado.jpg')";
            }
        case "Clouds":
            if (obtenerHora() > 7 && obtenerHora() < 19) {
                container.style.backgroundImage = "url('./images/parcial.jpg')";
                break;
            } else {
                container.style.backgroundImage =
                    "url('./images/noche-parcial.jpg')";
            }
    }
    console.log(weatherToday.estado);
};
const swap = document.getElementById("swap");
const template = document.getElementById("template_individual").content;
const fragment = document.createDocumentFragment();
const pintarIndividual = (weatherHour) => {
    weatherHour.forEach((element) => {
        template.querySelector("#swap--hora").textContent = element.hora;
        template.querySelector("#swap--temp").textContent = element.temp;
        let icono = template.querySelector("#icono-clima");
        const climaIcono = () => {
            if (element.desc == "Rain") {
                return clima.tormenta;
            }
            if (element.desc == "Clouds") {
                return clima.nublado;
            }
            if (element.desc == "Clear") {
                return clima.soleado;
            }
        };

        icono.setAttribute("src", `${climaIcono()}`);
        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });
    swap.appendChild(fragment);
};

const mañana = document.getElementById("mañana");
mañana.addEventListener("click", () => {
    swap.innerHTML = "";
    pintarIndividual(weatherHourTomorrow);
});
const hoy = document.getElementById("hoy");
hoy.addEventListener("click", () => {
    swap.innerHTML = "";
    pintarIndividual(weatherHour);
});
const semana = document.getElementById("semana");
semana.addEventListener("click", () => {
    swap.innerHTML = "";
    pintarIndividual(weatherDays);
});

export default api;
