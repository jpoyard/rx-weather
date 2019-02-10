import { AutocompleteElement } from './autocomplete';
import { LeafletElement } from './leaflet';
import { getMatchedTowns } from './town';
import { Commune } from './utility';
import { getMatchedCountries } from './country';
import { getWeather, getForecastDaily, WeatherInfoElement } from './weather';

import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

  const communeObservable = autocompleteTown.selectItem;

  /**
   * Update leafletElement
   */
  communeObservable.subscribe((commune: Commune) => {
    leafletElement.selectTown(commune);
  });

  /**
   * Retrieve weather
   */
  const weatherPositionObservable = autocompleteTown.selectItem.pipe(
    switchMap((commune: Commune) =>
      getWeather({
        lat: commune.centre.coordinates[1],
        lon: commune.centre.coordinates[0]
      })
    )
  );

  /**
   * Update weatherInfoElement
   */
  combineLatest(communeObservable, weatherPositionObservable).subscribe(
    ([commune, weatherPosition]) => {
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
}
