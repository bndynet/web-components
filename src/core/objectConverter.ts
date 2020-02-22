export const objectConverter = (value: string): object => JSON.parse(value.replace(/'/g, '"'));
