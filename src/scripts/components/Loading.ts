import { html, customElement, css } from 'lit-element';
import { RootElement } from '../common/RootElement';

@customElement('ui-loading')
export class Loading extends RootElement {
  public constructor() {
    super();
  }

  public render() {
    this.fillParent();
    return html`
      <div class="spinner-border text-${this.theme}" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    `;
  }
}