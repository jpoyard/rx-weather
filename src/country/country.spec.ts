import { MatchingItem } from '../utility';
import { getMatchedCountries } from './country';

describe('getMatchedCountries', () => {
  [
    { term: '', result: require('./countries.json') },
    { term: 'ran', result: ['France', 'Iran'] },
    { term: 'KA', result: ['Kazakhstan', 'Sri Lanka'] },
    { term: 'you', result: [] }
  ].forEach(({ term, result }: { term: string; result: string[] }) => {
    it(`when term is '${term}' then should return ${result}`, done => {
      // Given
      const expected = result.map(value => ({
        label: value,
        value
      }));

      // When
      getMatchedCountries(term).then(
        (actual: MatchingItem<string>[]) => {
          // Then
          expect(actual).toEqual(expected);
          done();
        },
        reject => {
          fail('unexpected error');
        }
      );
    });
  });
});
