import { html, property, TemplateResult } from 'lit-element';
import { RootElement, htmlElement } from '../../core';

import './style.scss';

@htmlElement(`indicator`)
export class Indicator extends RootElement {
  @property({
    converter: (value, type) => {
      const items: number[] = [];
      const num = Number(value);
      for (let i = 0; i < num; i++) {
        items.push(i);
      }
      return items;
    },
  })
  public length: number[] = [];
  @property({ type: Number }) public active = 0;

  public constructor() {
    super();
    this.theme = 'dark';
  }

  public render(): TemplateResult {
    return html`
      ${this.length.map(index => {
        const classes = `bg-${this.theme} ${index === this.active ? 'active' : ''}`.trim();
        return html`
          <span class="${classes}" @click=${(e: any) => this.itemClick(index, e)}></span>
        `;
      })}
    `;
  }

  private itemClick(index: number, event: any): any {
    if (index !== this.active) {
      this.active = index;
      const event = new CustomEvent<any>('index-changed', {
        detail: {
          index: this.active,
        },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    }
  }
}
