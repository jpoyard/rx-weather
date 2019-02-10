import { MatcherResult } from '../utility';
import { Observable } from 'rxjs';

const countriesItems: string[] = require('./countries.json');

export function getMatchedCountries(term: string): MatcherResult<string> {
  // console.info('create new query...');
  return new Observable(observer => {
    // console.info('create new observable...');
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

// const obs = getMatchedCountries('fran');

// const sub1 = obs.subscribe(r => console.info(r));
// const sub2 = obs.subscribe(r => console.info(r));
// const sub3 = obs.subscribe(r => console.info(r));
