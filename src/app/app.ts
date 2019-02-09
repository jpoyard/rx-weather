import { LeafletAdapter } from './leaflet/leaflet.class';
import { getMatchedTowns } from './town';
import { Commune } from './utility';
import { getMatchedCountries } from './country';
import { getWeather, getForecastDaily } from './weather/weather-services';
import { WeatherInfoElement } from './weather/weather-info.element';

import { AutocompleteElement } from './autocomplete/autocomplete.element';

export function initialize() {
  /**
   * load custom component
   */
  customElements.define('auto-complete', AutocompleteElement);
  customElements.define('weather-info', WeatherInfoElement);

  const map = new LeafletAdapter('leafletMapId');

  /**
   * initialize autocomplete matcher
   */
  (document.getElementById('ac-country') as AutocompleteElement<
    string
  >).matcherFunction = getMatchedCountries;

  const autocompleteTown = document.getElementById(
    'ac-town'
  ) as AutocompleteElement<Commune>;
  autocompleteTown.matcherFunction = getMatchedTowns;

  const weatherInfoElement = document.querySelector(
    'weather-info'
  ) as WeatherInfoElement;

  autocompleteTown.selectItem.on('select', (commune: Commune) => {
    console.table(commune);
  });

  autocompleteTown.selectItem.on('select', (commune: Commune) => {
    map.selectTown(commune);
    getWeather({
      lat: commune.centre.coordinates[1],
      lon: commune.centre.coordinates[0]
    }).then(
      weatherPosition => {
        getForecastDaily({ id: weatherPosition.id }).then(
          forecastDaily =>
            weatherInfoElement.update({
              town: commune,
              weatherPosition,
              forecastDaily
            }),
          reject => console.error(reject)
        );
      },
      reject => console.error(reject)
    );
  });
}
