import { LeafletAdapter } from './leaflet/leaflet.class';
import { getMatchedTowns } from './town';
import { Commune } from './utility';
import { getMatchedCountries } from './country';
import { getWeather, getForecastDaily } from './weather/weather-services';
import { WeatherArea } from './weather/weather-area.class';

import { AutocompleteElement } from './autocomplete/autocomplete.element';

export function initialize() {
  /**
   * load custom component
   */
  customElements.define('auto-complete', AutocompleteElement);

  const map = new LeafletAdapter('leafletMapId');
  const weatherArea = new WeatherArea(document.getElementById('weatherArea'));

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
  autocompleteTown.selectItemFunction = selectTown;

  function selectTown(commune: Commune) {
    map.selectTown(commune);
    getWeather({
      lat: commune.centre.coordinates[1],
      lon: commune.centre.coordinates[0]
    }).then(
      weatherPosition => {
        getForecastDaily({ id: weatherPosition.id }).then(
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
}
