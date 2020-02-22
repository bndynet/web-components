/* eslint-disable @typescript-eslint/no-explicit-any */
import { objectConverter } from './objectConverter';

describe('objectConverter', () => {
  it('should convert json string to an object', () => {
    const jsonStr = `{
      name: 'Bendy',
      age: 35,
      home-country: 'China',
      'like-colors': ['#ff0000', '#00ff00', ],
    }`;
    const jsonObject: any = objectConverter(jsonStr);
    expect(jsonObject['like-colors'][0]).toBe('#ff0000');
  });

  it('should convert array string to an array object', () => {
    const jsonStr = `[1, '2', 3,]`;
    const jsonObject: any = objectConverter(jsonStr);
    expect(jsonObject.length).toBe(3);
    expect(jsonObject[0]).toBe(1);
    expect(jsonObject[1]).toBe('2');
  });
});
