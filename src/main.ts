import { LeafletAdapter } from './leaflet/leaflet.class';
import { getMatchedTowns } from './town';
import { Commune, WeatherPosition } from './utility';
import { Autocomplete } from './autocomplete';
import { getMatchedCountries } from './country';
import { getWeather, getForecastDaily } from './weather/weather-services';
import { WeatherArea } from './weather/weather-area.class';
import { APP_ID } from './environment';

window.onload = () => {
  const map = new LeafletAdapter('leafletMapId');
  const weatherArea = new WeatherArea(document.getElementById('weatherArea'));
  let autocompleteTown: Autocomplete<Commune>;

  Array.from(document.getElementsByClassName('autocomplete')).forEach(
    element => {
      if (element.classList.contains('country')) {
        new Autocomplete(element as HTMLElement, getMatchedCountries);
      } else {
        autocompleteTown = new Autocomplete(
          element as HTMLElement,
          getMatchedTowns,
          selectTown
        );
      }
    }
  );

  function selectTown(commune: Commune) {
    map.selectTown(commune);
    getWeather({
      lat: commune.centre.coordinates[1],
      lon: commune.centre.coordinates[0],
      appId: APP_ID
    }).then(
      weatherPosition => {
        getForecastDaily({ id: weatherPosition.id, appId: APP_ID }).then(
          forecastDaily =>
            weatherArea.update({
              town: commune,
              weatherPosition,
              forecastDaily
            }),
          reject => console.error(reject)
        );
      },
      reject => console.error(reject)
    );
  }
};
