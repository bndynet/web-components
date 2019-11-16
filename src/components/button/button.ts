import { html, customElement, property, TemplateResult } from 'lit-element';
import { RootElement } from '../../common/RootElement';

import './button.scss';

@customElement('ui-button')
export class Button extends RootElement {
  @property({ type: Boolean }) public pending = false;
  @property({ type: String }) public text = '';
  @property({ type: Boolean }) public disabled = false;

  public constructor() {
    super();
    this.theme = 'light';
  }

  public render(): TemplateResult {
    return html`
      <button class="btn btn-${this.theme} ${this.pending ? 'pending' : ''}" type="button" ?disabled=${this.pending || this.disabled}>
        ${this.pending
          ? html`
              <div class="loading"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></div>
            `
          : ''}
        <div class="text">${this.text}</div>
      </button>
    `;
  }
}
