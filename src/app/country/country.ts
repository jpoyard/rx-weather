import { MatcherResult } from '../utility';
import { Observable, Subject } from 'rxjs';
import { multicast } from 'rxjs/operators';

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

// const multi: any = obs.pipe(multicast(() => new Subject()));

// const sub1 = multi.subscribe((r: any) => console.info(r));
// const sub2 = multi.subscribe((r: any) => console.info(r));
// const sub3 = multi.subscribe((r: any) => console.info(r));

// multi.connect();
