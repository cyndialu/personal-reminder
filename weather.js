// Weather Panel
const apiKey = process.env.OPEN_WEATHER_API_KEY;
const divWeather = document.getElementById('divWeather');

// Get latitude and longitude of users location and pass for API calls
function getGeoLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getLocation(latitude,longitude);
      getWeather(latitude,longitude);
    }, showError);  
  } else { 
    console.log('Geolocation is not supported by this browser.');
  }
}

// Get city name, state, and country from API call and populate data to UI
async function getLocation(lat,lon){
  try{
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const locationData = await response.json();
    //console.log(locationData);
    const locationName = locationData[0].name;
    const locationState = locationData[0].state;
    const locationCountry = locationData[0].country;
    //console.log(locationName, locationState, locationCountry);
    document.getElementById('location').innerHTML = `<p id="city">${locationName}</p>
                                                     <p id="state">${locationState}, ${locationCountry}</p>`;   
  }catch (error){
    console.error(`There was an error: `, error);
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
  //console.log(currentTemp, feelsLike, hiTemp, loTemp, description, icon);
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