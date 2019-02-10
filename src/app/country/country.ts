import { MatcherResult } from '../utility';
import { from } from 'rxjs';
import { filter, map, toArray } from 'rxjs/operators';

const countriesItems: string[] = require('./countries.json');

export function getMatchedCountries(term: string): MatcherResult<string> {
  return from(countriesItems).pipe(
    filter((item: string) => item.toUpperCase().includes(term.toUpperCase())),
    map(value => ({
      label: value,
      value
    })),
    toArray()
  );
}
