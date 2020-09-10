(() => {
  console.log('Here!!!');
  const weatherForm = document.querySelector('#weather-form');
  const searchInput = document.querySelector('#search');

  const position = document.querySelector('.location__position');
  const time = document.querySelector('.location__time');
  const temp = document.querySelector('.weather__temp');
  const desc = document.querySelector('.weather__desc');
  const icon = document.querySelector('.weather__icon');
  const humidity = document.querySelector('#humidity');
  const feels = document.querySelector('#feels');
  const clouds = document.querySelector('#clouds');
  const wind = document.querySelector('#wind');
  const visibility = document.querySelector('#visibility');

  weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    fetchWeather(searchInput.value);
  });

  function fetchWeather(location = 'sokoto') {
    const owm = 'ca558ab728c8a05e2e1a928a16b2e822';
    const nominatimApi = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${location}&format=json&limit=1`;
    const weatherApi = (lat, lon) =>
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${owm}`;

    fetch(nominatimApi)
      .then((res) => res.json())
      .then((response) => {
        return response[0];
      })
      .then((location) => {
        fetch(weatherApi(location.lat, location.lon))
          .then((res) => res.json())
          .then((weatherResponse) => {
            position.textContent = location.display_name;
            time.textContent = getDateTime(weatherResponse.current.dt);
            temp.textContent = Math.floor(weatherResponse.current.temp) + '˚';
            desc.textContent = weatherResponse.current.weather[0].description;
            icon.src = `https://openweathermap.org/img/wn/${weatherResponse.current.weather[0].icon}@2x.png`;

            humidity.textContent = weatherResponse.current.humidity;
            feels.textContent = Math.floor(weatherResponse.current.feels_like);
            clouds.textContent = weatherResponse.current.clouds;
            wind.textContent = Number(
              weatherResponse.current.wind_speed * 3.6
            ).toFixed(2);
            visibility.textContent = weatherResponse.current.visibility / 1000;
          })
          .catch((weatherError) => {
            console.error(weatherError);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getDateTime(dateTimeNumber) {
    let dt;
    // check for valid datetime input
    if (new Date(dateTimeNumber).getTime()) {
      console.log('getDateTime -> dateTimeNumber', 'dateTimeNumber');
      dt = dateTimeNumber * 1000;
    } else {
      dt = Date.now();
    }

    const date = new Date(dt);
    return date.toLocaleString('default', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
})();
