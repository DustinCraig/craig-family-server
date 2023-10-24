const convertEpochToTime = (epoch) => {
  const date = new Date(epoch);
  return date.toLocaleTimeString();
};

const parseDay = (day) => {
  const { temp, sunrise, sunset, weather } = day;
  let parsedTemp = typeof temp === "object" ? temp.day : temp;
  return {
    temp: parsedTemp,
    sunrise: convertEpochToTime(sunrise * 1000),
    sunset: convertEpochToTime(sunset * 1000),
    weather: weather.length ? weather[0].description : "",
  };
};

export function parseWeather(weather) {
  const { current, daily } = weather;
  const currentWeather = parseDay(current);
  const tomorrow = parseDay(daily[0]);

  return {
    current: currentWeather,
    tomorrow,
  };
}

export function weatherToText(parsedWeather) {
  let result = `Craig Family Weather Report:`;
  const { current, tomorrow } = parsedWeather;

  result += "\n";
  result += `The current weather is ${current.weather} and the temperature is: ${current.temp}`;
  result += "\n";
  result += `Tomorrow, the weather will be ${tomorrow.weather} and the temperature will be: ${tomorrow.temp}`;
  return result;
}
