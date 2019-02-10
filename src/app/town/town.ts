import {
  Commune,
  MatchingItem,
  convertToQueryString,
  MatcherResult
} from '../utility';
import { Observable } from 'rxjs';

const WANTED_PROPERTIES = [
  'nom',
  'code',
  'codesPostaux',
  'centre',
  'surface',
  'contour',
  'codeDepartement',
  'departement',
  'codeRegion',
  'region',
  'population'
];

export function getMatchedTowns(query: string): MatcherResult<Commune> {
  return new Observable<MatchingItem<Commune>[]>(observer => {
    const client = new XMLHttpRequest();
    const fields = WANTED_PROPERTIES.join(',');
    const queryParams = convertToQueryString([
      { name: 'nom', value: query },
      { name: 'fields', value: fields },
      { name: 'format', value: 'json' },
      { name: 'geometry', value: 'contour' }
    ]);

    client.open('GET', `https://geo.api.gouv.fr/communes?${queryParams}`, true);
    client.onreadystatechange = () => {
      if (client.readyState === 4) {
        if (client.status === 200) {
          const items: Commune[] = JSON.parse(client.responseText);
          observer.next(
            items.map((item: Commune) => ({ label: item.nom, value: item }))
          );
          observer.complete();
        } else {
          observer.error(
            client.statusText ? client.statusText : 'unexpected error'
          );
        }
      }
    };
    client.send();
  });
}
