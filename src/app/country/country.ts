import { MatcherResult } from '../utility';
import { Observable } from 'rxjs';

const countriesItems: string[] = require('./countries.json');

export function getMatchedCountries(term: string): MatcherResult<string> {
  return new Observable(observer => {
    observer.next(
      countriesItems
        .filter(item => item.toUpperCase().includes(term.toUpperCase()))
        .map(value => ({
          label: value,
          value
        }))
    );
    observer.complete();
  });
}
