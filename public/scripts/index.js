(() => {
  console.log('Here!!!');
  const weatherForm = document.querySelector('#weather-form');
  const mobWeatherForm = document.querySelector('#mob-weather-form');
  const searchInput = document.querySelector('#search');
  const mobSearchInput = document.querySelector('#mob-search');

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

  let searchHistory = [];

  weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchHistory.unshift(searchInput.value);
    if (searchHistory.length > 3) {
      searchHistory.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    fetchWeather(searchInput.value);
  });

  mobWeatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchHistory.unshift(mobSearchInput.value);
    if (searchHistory.length > 3) {
      searchHistory.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    fetchWeather(mobSearchInput.value);
  });

  let location;
  let weather;

  const setPageItems = () => {
    console.log('setPageItems -> searchHistory', searchHistory);

    location = JSON.parse(localStorage.getItem('location'));
    weather = JSON.parse(localStorage.getItem('weatherResponse'));

    if (location && weather) {
      searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
      if (searchInput) {
        searchInput.value = searchHistory ? searchHistory[0] : '';
      } else if (mobSearchInput) {
        mobSearchInput.value = searchHistory ? searchHistory[0] : '';
      }
      position.textContent = location.display_name;
      time.textContent = getDateTime(weather.current.dt);
      temp.textContent = Math.floor(weather.current.temp) + '˚';
      desc.textContent = weather.current.weather[0].description;
      icon.src = `https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`;

      humidity.textContent = weather.current.humidity;
      feels.textContent = Math.floor(weather.current.feels_like);
      clouds.textContent = weather.current.clouds;
      wind.textContent = Number(weather.current.wind_speed * 3.6).toFixed(2);
      visibility.textContent = weather.current.visibility / 1000;
    }
  };

  setPageItems();

  function fetchWeather(locationInput = 'sokoto') {
    const owm = 'ca558ab728c8a05e2e1a928a16b2e822';
    const nominatimApi = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${locationInput}&format=json&limit=1`;
    const weatherApi = (lat, lon) =>
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${owm}`;

    fetch(nominatimApi)
      .then((res) => res.json())
      .then((response) => {
        return response[0];
      })
      .then((loc) => {
        localStorage.setItem('location', JSON.stringify(loc));
        fetch(weatherApi(loc.lat, loc.lon))
          .then((res) => res.json())
          .then((weatherResponse) => {
            localStorage.setItem(
              'weatherResponse',
              JSON.stringify(weatherResponse)
            );
            setPageItems();
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
