export const objectConverter = (value: string): object =>
  JSON.parse(
    value
      .replace(/([^'"\s{:,]+?)(?=:)/g, '"$1"')
      .replace(/,\s*?([}\]])/g, '$1')
      .replace(/'/g, '"'),
  );
