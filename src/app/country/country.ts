import { MatchingItem } from '../utility';

const countriesItems: string[] = require('./countries.json');

export function getMatchedCountries(
  term: string
): Promise<MatchingItem<string>[]> {
  return new Promise(resolve => {
    resolve(
      countriesItems
        .filter(item => item.toUpperCase().includes(term.toUpperCase()))
        .map(value => ({
          label: value,
          value
        }))
    );
  });
}
