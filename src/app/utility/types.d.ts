export declare interface MatchingItem<T> {
  label: string;
  value: T;
}

export declare type MatcherFunction<T> = (
  term: string
) => Promise<MatchingItem<T>[]>;

export declare interface Commune {
  nom: string;
  code: string;
  codesPostaux: string[];
  centre: {
    type: 'Point';
    coordinates: number[];
  };
  surface: number;
  contour: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  codeDepartement: string;
  codeRegion: string;
  population: number;
  departement: { code: string; nom: string };
  region: { code: string; nom: string };
}

export declare interface WeatherPosition {
  coord: { lon: number; lat: number };
  weather: [{ id: number; main: string; description: string; icon: string }];
  base: string;
  main: {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    sea_level: number;
    grnd_level: number;
  };
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: {
    message: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  id: number;
  name: string;
  cod: number;
}

export declare interface Daily {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  weather: [{ id: number; main: string; description: string; icon: string }];
  speed: number;
  deg: number;
  clouds: number;
  snow: number;
}

export declare interface ForecastDaily {
  city: {
    id: number;
    name: string;
    coord: { lon: number; lat: number };
    country: string;
    population: number;
  };
  cod: string;
  message: number;
  cnt: number;
  list: Daily[];
}
