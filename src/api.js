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
                max: floorTemp(data.daily[0].temp.max),
                min: floorTemp(data.daily[0].temp.min),
                humedad: data.current.humidity,
                viento: data.current.wind_speed,
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
                max: floorTemp(data.daily[1].temp.max),
                min: floorTemp(data.daily[1].temp.min),
                humedad: data.daily[1].humidity,
                viento: data.daily[1].wind_speed,
            };
            hora += 1;

            weatherHourTomorrow.push(item);
        }
        console.log(weatherHourTomorrow);
        //LOGICA DE SEMANA

        for (let i = 0; i < data.daily.length; i++) {
            let item = {
                temp: floorTemp(data.daily[i].temp.eve),
                desc: data.daily[i].weather[0].main,
                dia: diasSemana2[fecha.getDay() + i],
                max: floorTemp(data.daily[0].temp.max),
                min: floorTemp(data.daily[0].temp.min),
                humedad: data.current.humidity,
                viento: data.current.wind_speed,
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
    console.log(hora);
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
const pintarBottom = (weatherToday) => {
    const max = (document.getElementById(
        "max"
    ).innerText = ` ${weatherToday[0].max}`);
    const min = (document.getElementById(
        "min"
    ).innerText = ` ${weatherToday[0].min}`);
    const viento = (document.getElementById(
        "viento"
    ).innerText = ` ${weatherToday[0].viento} Km/H`);
    const humedad = (document.getElementById(
        "humedad"
    ).innerText = ` ${weatherToday[0].humedad} %`);
};
const pintarCard = (weatherToday) => {
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
    console.log(weatherToday);
    const container = document.getElementById("container");
    const temperature = (document.getElementById("temperature").innerText =
        weatherToday.temp);
    const city = (document.getElementById(
        "city"
    ).innerHtml = `<img src="./icons/Property 1=map-pin.svg" alt="">${weatherToday.lugar}`);
    const fecha = (document.getElementById("fecha").innerText = obtenerFecha());

    // Rain, Clear, Clouds

    if (obtenerHora() >= 7 && obtenerHora() <= 19) {
        switch (weatherToday.estado) {
            case "Rain":
                container.style.backgroundImage =
                    "url('./images/lluvioso.jpg')";
                break;
            case "Clear":
                container.style.backgroundImage = "url('./images/soleado.jpg')";
                break;
            case "Clouds":
                container.style.backgroundImage = "url('./images/parcial.jpg')";
                break;
        }
    } else {
        switch (weatherToday.estado) {
            case "Rain":
                container.style.backgroundImage =
                    "url('./images/noche-lluvioso.jpg')";
                break;
            case "Clear":
                container.style.backgroundImage =
                    "url('../images/noche-despejado.jpg')";
                break;
            case "Clouds":
                container.style.backgroundImage =
                    "url('./images/noche-parcial.jpg')";
                break;
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
    pintarBottom(weatherHour);
};
const tabla_estado_diario = document.getElementById("tabla_estado_diario");
const tabla_estado_semanal = document.getElementById("tabla_estado_semanal");
const tabla_template = document.getElementById("tabla_template").content;
const tabla_fragment = document.createDocumentFragment();
const pintarTabla = (weather) => {
    weather.forEach((element) => {
        tabla_template.querySelector("#tabla_dia").textContent = element.hora;
        tabla_template.querySelector("#tabla_temp").textContent = element.temp;
        let icono = tabla_template.querySelector("#tabla_icono");
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
        const clone = tabla_template.cloneNode(true);
        tabla_fragment.appendChild(clone);
    });
    tabla_estado_semanal.appendChild(fragment);
};

const hoy = document.getElementById("hoy");
hoy.addEventListener("click", () => {
    swap.innerHTML = "";
    tabla_estado_semanal.classList.add("esconder");
    tabla_estado_diario.classList.remove("esconder");
    pintarIndividual(weatherHour);
    mañana.classList.remove("is-selected");
    hoy.classList.add("is-selected");
    semana.classList.remove("is-selected");
    siguiente_semana.classList.remove("is-selected");
});
const mañana = document.getElementById("mañana");
mañana.addEventListener("click", () => {
    swap.innerHTML = "";
    tabla_estado_semanal.classList.add("esconder");
    tabla_estado_diario.classList.remove("esconder");
    pintarIndividual(weatherHourTomorrow);
    mañana.classList.add("is-selected");
    hoy.classList.remove("is-selected");
    semana.classList.remove("is-selected");
    siguiente_semana.classList.remove("is-selected");
});
const semana = document.getElementById("semana");
semana.addEventListener("click", () => {
    swap.innerHTML = "";
    tabla_estado_semanal.classList.remove("esconder");
    tabla_estado_diario.classList.add("esconder");
    pintarTabla(weatherDays);
    mañana.classList.remove("is-selected");
    hoy.classList.remove("is-selected");
    semana.classList.add("is-selected");
    siguiente_semana.classList.remove("is-selected");
});
const siguiente_semana = document.getElementById("siguiente_semana");
siguiente_semana.addEventListener("click", () => {
    swap.innerHTML = "";
    tabla_estado_semanal.classList.remove("esconder");
    tabla_estado_diario.classList.add("esconder");
    pintarTabla(weatherDays);
    mañana.classList.remove("is-selected");
    hoy.classList.remove("is-selected");
    semana.classList.remove("is-selected");
    siguiente_semana.classList.add("is-selected");
});

export default api;
