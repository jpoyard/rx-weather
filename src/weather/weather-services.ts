import {
  WeatherPosition as WeatherAtPosition,
  convertToQueryString,
  ForecastDaily
} from '../utility';

export function getWeather({
  lat,
  lon,
  appId
}: {
  lat: number;
  lon: number;
  appId: string;
}): Promise<WeatherAtPosition> {
  return new Promise((resolve, reject) => {
    const client = new XMLHttpRequest();
    const queryParams = convertToQueryString([
      { name: 'lat', value: lat },
      { name: 'lon', value: lon },
      { name: 'appid', value: appId }
    ]);

    client.open(
      'GET',
      `https://openweathermap.org/data/2.5/weather?${queryParams}`,
      true
    );
    client.onreadystatechange = () => {
      if (client.readyState === 4) {
        if (client.status === 200) {
          resolve(JSON.parse(client.responseText) as WeatherAtPosition);
        } else {
          reject(client.statusText ? client.statusText : 'unexpected error');
        }
      }
    };
    client.send();
  });
}

export function getForecastDaily({
  id,
  appId
}: {
  id: number;
  appId: string;
}): Promise<ForecastDaily> {
  return new Promise((resolve, reject) => {
    const client = new XMLHttpRequest();
    const queryParams = convertToQueryString([
      { name: 'id', value: id },
      { name: 'appid', value: appId },
      { name: 'units', value: 'metric' }
    ]);

    client.open(
      'GET',
      `https://openweathermap.org/data/2.5/forecast/daily/?${queryParams}`,
      true
    );
    client.onreadystatechange = () => {
      if (client.readyState === 4) {
        if (client.status === 200) {
          resolve(JSON.parse(client.responseText) as ForecastDaily);
        } else {
          reject(client.statusText ? client.statusText : 'unexpected error');
        }
      }
    };
    client.send();
  });
}
