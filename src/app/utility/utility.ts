export function convertToQueryString(
  queryParams: {
    name: string;
    value: any;
  }[]
): string {
  return queryParams
    .reduce(
      (
        acc,
        {
          name,
          value
        }: {
          name: string;
          value: any;
        }
      ) => [...acc, `${name}=${new String(value).toString()}`],
      []
    )
    .join('&');
}

export function copy<T>(o: T) {
  let out: any, v: any, key: string;
  out = Array.isArray(o) ? [] : {};
  Object.entries(o).forEach(entry => {
    v = entry[1];
    out[entry[0]] = typeof v === 'object' && v !== null ? copy(v) : v;
  });
  return out;
}
