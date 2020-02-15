/* eslint-disable @typescript-eslint/no-explicit-any */
import { customElement } from 'lit-element';
import { ELMENT_PREFIX } from './config';

export const htmlElement: any = (tagName: string): any => {
  return customElement(`${ELMENT_PREFIX}${tagName}`);
};
