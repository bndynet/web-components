import { html, customElement, property } from 'lit-element';
import { RootElement } from './common/RootElement';

@customElement('app-loading')
export class AppLoading extends RootElement {
  public render() {
    return html`
      <div class="spinner-border text-${this.theme}" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    `;
  }
}