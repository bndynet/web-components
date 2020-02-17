import { html, TemplateResult, property } from 'lit-element';
import { SelectInput } from './select-input';
import { htmlElement } from '../../core';

import './style.scss';

@htmlElement(`select`)
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
