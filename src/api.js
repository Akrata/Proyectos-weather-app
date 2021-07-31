const API_KEY = "edbd7f5332b0eacf66210e464485e33b";

let clima = {
    soleado: "./icons/Sun.svg",
    nublado: "./icons/Cloud.svg",
    lluvia: "./icons/Cloud-drizzle.svg",
    tormenta: "./icons/Cloud-lightning.svg",
};
let weatherHourTomorrow = [];
let weatherDays = [];
let weatherHour = [];

function toggleFullscreen(elem) {
    elem = elem || document.documentElement;

    if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
    ) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

document
    .getElementById("pantalla_completa")
    .addEventListener("click", function () {
        toggleFullscreen();
    });

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

        for (let i = 1; i < data.daily.length; i++) {
            let today = new Date();
            let item = {
                temp: floorTemp(data.daily[i].temp.eve),
                desc: data.daily[i].weather[0].main,
                dia: obtenerDia(sumarDias(today, i)),
                max: floorTemp(data.daily[0].temp.max),
                min: floorTemp(data.daily[0].temp.min),
            };
            today += 1;
            console.log(today);
            console.log(item);
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
const obtenerDia = (fecha) => {
    let diasSemana = new Array(
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
    );
    return diasSemana[fecha.getDay()];
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

function sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

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
                    "url('./images/noche-despejado.jpg')";
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
    console.log(swap);
    pintarBottom(weatherHour);
};
const tabla_estado_diario = document.getElementById("tabla_estado_diario");
const tabla_estado_semanal = document.getElementById("tabla_estado_semanal");

const tr_tabla = document.querySelector("#tr_tabla");
const template_tabla = document.querySelector("#tabla_template").content;
const fragment_tabla = document.createDocumentFragment();
const pintarTabla = (weather) => {
    weather.forEach((element) => {
        template_tabla.querySelector("#tabla_dia").textContent = element.dia;
        let icono = template_tabla.querySelector("#tabla_icono");
        template_tabla.querySelector("#tabla_temp").textContent = element.temp;
        template_tabla.querySelector("#tabla_max").textContent = element.max;
        template_tabla.querySelector("#tabla_min").textContent = element.min;
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
        let clone = template_tabla.cloneNode(true);
        fragment_tabla.appendChild(clone);
    });
    tr_tabla.appendChild(fragment_tabla);
};

let booleano = false;
const modificarTamaño = (bool) => {
    if (bool) {
        document.getElementById("swapInfo").classList.remove("swap-top");
        document.getElementById("swapInfo").classList.add("swap-top-big");
        document.getElementById("swapButton").classList.remove("swap-card");
        document.getElementById("swapButton").classList.add("swap-card-big");
        document.getElementById("swapInfo").classList.remove("swapInfo");
        document.getElementById("swapInfo").classList.add("swapInfo-big");
    } else {
        document.getElementById("swapInfo").classList.remove("swap-top-big");
        document.getElementById("swapInfo").classList.add("swap-top");
        document.getElementById("swapButton").classList.remove("swap-card-big");
        document.getElementById("swapButton").classList.add("swap-card");
        document.getElementById("swapInfo").classList.remove("swapInfo-big");
        document.getElementById("swapInfo").classList.add("swapInfo");
    }
};

const hoy = document.getElementById("hoy");
hoy.addEventListener("click", () => {
    swap.innerHTML = "";
    tr_tabla.innerHtml = "";
    tabla_estado_semanal.classList.add("esconder");
    tabla_estado_diario.classList.remove("esconder");
    pintarIndividual(weatherHour);
    mañana.classList.remove("is-selected");
    hoy.classList.add("is-selected");
    semana.classList.remove("is-selected");
    siguiente_semana.classList.remove("is-selected");
    modificarTamaño(false);
    booleano = false;
});
const mañana = document.getElementById("mañana");
mañana.addEventListener("click", () => {
    swap.innerHTML = "";
    tr_tabla.innerHtml = "";
    tabla_estado_semanal.classList.add("esconder");
    tabla_estado_diario.classList.remove("esconder");
    pintarIndividual(weatherHourTomorrow);
    mañana.classList.add("is-selected");
    hoy.classList.remove("is-selected");
    semana.classList.remove("is-selected");
    siguiente_semana.classList.remove("is-selected");
    modificarTamaño(false);
    booleano = false;
});
const semana = document.getElementById("semana");
semana.addEventListener("click", () => {
    swap.innerHTML = "";
    tr_tabla.innerHTML =
        '<tr><th class="left">Dia</th><th>Estado</th><th>Temp</th><th>Max</th><th>Min</th></tr>';
    tabla_estado_semanal.classList.remove("esconder");
    tabla_estado_diario.classList.add("esconder");
    mañana.classList.remove("is-selected");
    hoy.classList.remove("is-selected");
    semana.classList.add("is-selected");
    siguiente_semana.classList.remove("is-selected");
    modificarTamaño(true);
    booleano = true;
    pintarTabla(weatherDays);
});
const siguiente_semana = document.getElementById("siguiente_semana");
siguiente_semana.addEventListener("click", () => {
    swap.innerHTML = "";
    tr_tabla.innerHTML =
        '<tr><th class="left">Dia</th><th>Estado</th><th>Temp</th><th>Max</th><th>Min</th></tr>';
    console.log(tr_tabla);
    tabla_estado_semanal.classList.remove("esconder");
    tabla_estado_diario.classList.add("esconder");
    mañana.classList.remove("is-selected");
    hoy.classList.remove("is-selected");
    semana.classList.remove("is-selected");
    siguiente_semana.classList.add("is-selected");
    modificarTamaño(true);
    booleano = true;
    pintarTabla(weatherDays);
});

const swapButton = document.getElementById("swapButton");
const swapInfo = document.getElementById("swapInfo");

swapButton.onclick = () => {
    if (booleano == false) {
        swapButton.classList.toggle("swap-card");
        swapInfo.classList.toggle("swap-top");
    } else {
        swapButton.classList.toggle("swap-card-big");
        swapInfo.classList.toggle("swap-top-big");
    }
};
