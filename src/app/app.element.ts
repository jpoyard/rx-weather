import { AutocompleteElement } from './autocomplete';
import { LeafletElement } from './leaflet';
import { getMatchedTowns } from './town';
import { Commune } from './utility';
import { getMatchedCountries } from './country';
import { getWeather, getForecastDaily, WeatherInfoElement } from './weather';

export function initialize() {
  /**
   * load custom component
   */
  customElements.define('auto-complete', AutocompleteElement);
  customElements.define('weather-info', WeatherInfoElement);
  customElements.define('leaflet-map', LeafletElement);

  /**
   * initialize autocomplete matcher
   */
  const autocompleteCountry = (document.getElementById(
    'ac-country'
  ) as AutocompleteElement<string>) as AutocompleteElement<string>;
  autocompleteCountry.matcherFunction = getMatchedCountries;

  const autocompleteTown = document.getElementById(
    'ac-town'
  ) as AutocompleteElement<Commune>;
  autocompleteTown.matcherFunction = getMatchedTowns;

  const leafletElement = document.querySelector(
    'leaflet-map'
  ) as LeafletElement;

  const weatherInfoElement = document.querySelector(
    'weather-info'
  ) as WeatherInfoElement;

  autocompleteTown.selectItem.subscribe((commune: Commune) => {
    console.table(commune);
  });

  autocompleteTown.selectItem.subscribe((commune: Commune) => {
    leafletElement.selectTown(commune);
    getWeather({
      lat: commune.centre.coordinates[1],
      lon: commune.centre.coordinates[0]
    }).subscribe(
      weatherPosition => {
        getForecastDaily({ id: weatherPosition.id }).subscribe(
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
