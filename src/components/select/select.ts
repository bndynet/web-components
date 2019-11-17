import { html, customElement, TemplateResult, property } from 'lit-element';
import { SelectInput } from './select-input';

import './select.scss';

const TAG_NAME = 'ui-select';

@customElement(TAG_NAME)
export class Select extends SelectInput {
  @property({ type: String }) label = '';

  protected render(): TemplateResult {
    return html`
      <div class="form-group">
        <label>${this.label}</label>
        ${super.render()}
      </div>
    `;
  }
}
