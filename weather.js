// Weather Panel
const apiKey = process.env.OPEN_WEATHER_API_KEY;
const divWeather = document.getElementById('divWeather');

// Get latitude and longitude of users location and pass for API call
function getGeoLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      //console.log(latitude,longitude);
      getWeather(latitude,longitude);
    }, showError);  
  } else { 
    console.log('Geolocation is not supported by this browser.');
  }
}

// Get data from weather API call
async function getWeather(lat,lon){
  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
    const weatherData = await response.json();
    //console.log(weatherData);
    displayWeather(weatherData);
  }catch (error){
    console.error(`There was an error: `, error);
  } 
}

// Populate weather data to UI
function displayWeather(data){
  const currentTemp = parseInt(data.main.temp);
  const feelsLike = parseInt(data.main.feels_like);
  const hiTemp = parseInt(data.main.temp_max);
  const loTemp = parseInt(data.main.temp_min);
  const icon = data.weather[0].icon;
  const iconurl = `https://openweathermap.org/img/w/${icon}.png`;
  const description = data.weather[0].description;
  const locationName = data.name;
  const locationCountry = data.sys.country;
  //console.log(currentTemp, feelsLike, hiTemp, loTemp, description, icon);
  document.getElementById('location').innerHTML = `<p id="city">${locationName}</p>
                                                   <p id="country">${locationCountry}</p>`;
  document.getElementById('currentTemp').innerHTML = `${currentTemp}&deg;`;
  document.getElementById('feelsLike').innerHTML = `RealFeel: ${feelsLike}&deg;`;
  document.getElementById('highLow').innerHTML = `H: ${hiTemp}&deg;  L: ${loTemp}&deg;`;
  document.getElementById('weather').innerHTML = `<img id="imgIcon" src="${iconurl}" alt="weather icon">${description}`;
}

// Show error message from getting user GeoLocation
function showError(error){
  divWeather.innerHTML = error.message;
}

getGeoLocation();