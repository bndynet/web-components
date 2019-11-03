import { html, customElement, css } from 'lit-element';
import { RootElement } from '../../common/RootElement';

@customElement('ui-loading')
export class Loading extends RootElement {
  public constructor() {
    super();
  }

  public render() {
    this.fillParent(this.theme === 'dark'
      ? `background-color: rgba(0, 0, 0, 0.4); z-index: 99999;`
      : `background-color: rgba(255, 255, 255, 0.4); z-index: 99999`
      );
    const spinnerTheme = this.theme === 'dark' ? 'text-light' : '';
    return html`
      <div class="spinner-border ${spinnerTheme}" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    `;
  }
}