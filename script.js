const apiKey = 'b9cc2b5839c944c6806171156241909';

document.getElementById('boton-buscar').addEventListener('click', () => {
    const ciudad = document.getElementById('input-ciudad').value;
    obtenerClima(ciudad);
});

document.getElementById('boton-ubicacion').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            obtenerClima(`${latitude},${longitude}`);
        }, error => {
            console.log('Error al obtener ubicación:', error);
            alert('No se pudo obtener la ubicación. Por favor, intenta nuevamente.');
        });
    } else {
        alert('La geolocalización no está soportada por tu navegador.');
    }
});

function obtenerClima(ciudad) {
    const apiURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ciudad}&days=7&lang=es`;

    document.getElementById('loading-spinner').style.display = 'block';

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            mostrarClima(data);
            mostrarPronostico(data.forecast);
            mostrarAlertas(data.alerts);
            document.getElementById('loading-spinner').style.display = 'none';
        })
        .catch(error => {
            console.log('Error:', error);
            document.getElementById('loading-spinner').style.display = 'none';
        });
}

function mostrarClima(data) {
    document.getElementById('ciudad').textContent = data.location.name;
    document.getElementById('icono-clima').src = data.current.condition.icon;
    document.getElementById('condicion').textContent = data.current.condition.text;
    document.getElementById('temperatura').textContent = `${data.current.temp_c}°C`;
    document.getElementById('humedad').textContent = `${data.current.humidity}%`;
    document.getElementById('viento').textContent = `${data.current.wind_kph} km/h`;

    const climaInfo = document.getElementById('clima-info');
    climaInfo.classList.add('mostrar');
}

function mostrarPronostico(forecast) {
    const forecastElement = document.getElementById('forecast');
    forecastElement.innerHTML = '';

    forecast.forecastday.forEach(dia => {
        forecastElement.innerHTML += `
            <div class="forecast-day">
                <p>${dia.date}</p>
                <img src="${dia.day.condition.icon}" alt="${dia.day.condition.text}">
                <p>${dia.day.condition.text}</p>
                <p>Max: ${dia.day.maxtemp_c}°C Min: ${dia.day.mintemp_c}°C</p>
            </div>
        `;
    });
    forecastElement.style.display = 'block';
}

function mostrarAlertas(alerts) {
    const alertElement = document.getElementById('weather-alerts');
    if (alerts && alerts.alert.length > 0) {
        alertElement.innerHTML = `<p>${alerts.alert[0].headline}</p>`;
        alertElement.style.display = 'block';
    }
}

document.getElementById('toggle-theme').addEventListener('change', () => {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');

    if (body.dataset.theme === 'dark') {
        body.dataset.theme = 'light';
        themeIcon.classList.replace('ri-moon-line', 'ri-sun-line');
    } else {
        body.dataset.theme = 'dark';
        themeIcon.classList.replace('ri-sun-line', 'ri-moon-line');
    }
});

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        obtenerClima(`${latitude},${longitude}`);
    });
}