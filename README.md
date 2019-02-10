## Step 1 (Cold Observable)

- [x] install [RxJs](https://github.com/reactivex/rxjs) and [@reactivex/rxjs](https://github.com/reactivex/rxjs) dependencies
- [x] install [rxjs-tslint](https://github.com/ReactiveX/rxjs-tslint) linter
- [x] replace Promise by Observable
  - [x] update `weather-services.ts` file
  - [x] update `town.ts` file
  - [x] update `country.ts` file
  - [x] update `autocomplete.element.ts` file
  - [x] update `app.element.ts` file
  - [x] update `country.spec.ts` file

## Step 2 (Hot Observable)

- [x] replace addEventListener (`input` event) by Observable
  - [x] update `autocomplete.element.ts` file

## Step 3 (Subject)

- [x] replace EventEmitter by Subject/Observable
  - [x] update `autocomplete.element.ts` file
  - [x] update `app.element.ts` file

## Step 4 (Operators)

- [x] use operators `filter`, `map` and `toArray` in `country.ts` file
- [x] use operators `debounceTime`, `map` and `distinctUntilChanged` in `autocomplete.element.ts` file
- [x] use operators `combineLatest` and `switchMap` in `app.element.ts` file
