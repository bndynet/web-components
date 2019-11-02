import { html, customElement, property } from 'lit-element';
import { RootElement } from '../common/RootElement';

@customElement('ui-button')
export class Button extends RootElement {
  @property({type: Boolean}) public pending: boolean = false;
  @property({type: String}) public text = '';
  @property({type: Boolean}) public disabled: boolean = false;

  public constructor() {
    super();
  }

  public render() {
    return html`
      <button class="btn btn-${this.theme}" type="button" ?disabled=${this.pending || this.disabled}>
        ${this.pending ? html`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>` : ''}
        ${this.text}
      </button>
    `;
  }
}