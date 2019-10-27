import { html, customElement, property } from 'lit-element';
import { RootElement } from './common/RootElement';

@customElement('process-button')
export class ProcessButton extends RootElement {
  @property({type: Boolean}) public processing: boolean = false;
  @property({type: String}) public text: any;
  @property({type: String}) public prefixIconClass: any;

  public render() {
    return html`
      <button class="btn btn-${this.theme}" type="button" ?disabled=${this.processing}>
        ${this.processing ? html`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>` : ''}
        ${this.text}
      </button>
    `;
  }
}