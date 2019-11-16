import { html, customElement, TemplateResult } from 'lit-element';
import { RootElement } from '../../common/RootElement';

import './loading.scss';

@customElement('ui-loading')
export class Loading extends RootElement {
  public constructor() {
    super();
  }

  public render(): TemplateResult {
    this.fillParent(this.theme === 'dark' ? `background-color: rgba(0, 0, 0, 0.4); z-index: 99999;` : `background-color: rgba(255, 255, 255, 0.4); z-index: 99999`);
    const spinnerTheme = this.theme === 'dark' ? 'text-light' : `text-${this.theme}`;
    return html`
      <div class="spinner-border ${spinnerTheme}" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    `;
  }
}
