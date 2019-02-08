import {
  WeatherPosition as WeatherAtPosition,
  convertToQueryString,
  ForecastDaily
} from '../utility';

import { APP_ID } from './../../environment';

export function getWeather({
  lat,
  lon
}: {
  lat: number;
  lon: number;
}): Promise<WeatherAtPosition> {
  return new Promise((resolve, reject) => {
    const client = new XMLHttpRequest();
    const queryParams = convertToQueryString([
      { name: 'lat', value: lat },
      { name: 'lon', value: lon },
      { name: 'appid', value: APP_ID }
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
  id
}: {
  id: number;
}): Promise<ForecastDaily> {
  return new Promise((resolve, reject) => {
    const client = new XMLHttpRequest();
    const queryParams = convertToQueryString([
      { name: 'id', value: id },
      { name: 'appid', value: APP_ID },
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
