import { customElement, html, property, TemplateResult } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { RootElement } from '../../common/RootElement';

import './input.scss';

@customElement('ui-input')
export class Input extends RootElement {
  @property({ type: String }) label = '';
  @property({ type: String, reflect: true }) value = '';
  @property({ type: String }) type = 'text';
  @property({ type: String }) prefix = '';
  @property({ type: String }) suffix = '';
  @property({ type: String }) tips = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean }) required = false;
  @property({ type: String, attribute: 'required-message' }) requiredMessage = '';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) isRequiredInvalid = false;
  @property({ type: String }) pattern = '';
  @property({ type: String, attribute: 'pattern-message' }) patternMessage = '';
  @property({ type: Boolean }) isPatternInvalid = false;
  @property({ type: Boolean }) validate = false;

  @property({ type: String }) feedbackMessage = '';

  private emptyValue: boolean;

  public constructor() {
    super();
    this.emptyValue = !this.value;
  }

  protected render(): TemplateResult {
    const htmlTipsClass = { col: this.label, 'text-right': this.label };
    const inputClass = {
      'form-control': true,
      'is-invalid': this.isInvalid(),
      'is-valid': this.isValid(),
    };
    const feedbackClass = {
      col: true,
      'text-right': true,
      'invalid-feedback': this.isInvalid(),
      'valid-feedback': this.isValid(),
    };
    const colorFlagClass = {
      'input-group-flag': true,
      'input-group-flag-empty': !this.value,
    };
    let htmlAdditionalMessage: TemplateResult = html``;
    if (this.feedbackMessage) {
      htmlAdditionalMessage = html`
        <div class="${classMap(feedbackClass)}">${this.feedbackMessage}</div>
      `;
    } else if (this.tips) {
      htmlAdditionalMessage = html`
        <small class="${classMap(htmlTipsClass)} form-text text-muted">${this.tips}</small>
      `;
    }
    return html`
      <div class="form-group">
        ${this.ifShowHtml(
          !!this.label,
          html`
            <div class="row">
              <label for="${this.ifAttr(!!this.id, `${this.id}-input`)}" class="col-md-auto">${unsafeHTML(this.label)}</label>
              ${htmlAdditionalMessage}
            </div>
          `,
        )}
        <div class="input-group">
          ${this.prefix &&
            html`
              <div class="input-group-prepend">
                <span class="input-group-text">${this.prefix}</span>
              </div>
            `}
          <input id="${this.ifAttr(!!this.id, `${this.id}-input`)}" name="${this.ifAttr(!!this.id, `${this.id}-input`)}" type="${this.type === 'color-text' ? 'text' : this.type}" value="${this.value}" class="${classMap(inputClass)}" placeholder="${this.placeholder}" ?disabled=${this.disabled} ?required=${this.required} aria-label="${this.placeholder}" />
          ${this.suffix &&
            html`
              <div class="input-group-append">
                <span class="input-group-text">${this.suffix}</span>
              </div>
            `}
          ${this.type === 'color-text'
            ? html`
                <div class="input-group-append">
                  <span class="input-group-text">
                    <span class="${classMap(colorFlagClass)}" style="background-color: ${this.value}"></span>
                  </span>
                </div>
              `
            : ``}
        </div>
        ${this.ifShowHtml(!this.label, htmlAdditionalMessage)}
      </div>
    `;
  }

  protected firstUpdated(): void {
    const eleInput = this.getElementsByTagName('input')[0];
    if (this.validate) {
      this.checkInputValue();
    }
    const fnCheck = (): void => {
      this.validate = true;
      this.checkInputValue();
    };
    eleInput.addEventListener('blur', fnCheck);
    eleInput.addEventListener('focus', fnCheck);
    eleInput.addEventListener('input', fnCheck);
  }

  public attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    if (name === 'value') {
      this.checkInputValue();
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  private isInvalid(): boolean {
    if (!this.validate) {
      return false;
    }
    return (this.required && this.isRequiredInvalid) || (!!this.pattern && this.isPatternInvalid);
  }

  private isValid(): boolean {
    if ((!this.required && !this.pattern) || !this.validate) {
      return false;
    }

    return (this.required && !this.isRequiredInvalid) || (!this.emptyValue && !!this.pattern && !this.isPatternInvalid);
  }

  private checkInputValue(): void {
    const eleInput = this.getElementsByTagName('input')[0];
    if (!eleInput) {
      return;
    }
    this.value = eleInput.value;
    this.isRequiredInvalid = false;
    this.isPatternInvalid = false;
    this.feedbackMessage = '';
    this.emptyValue = !this.value;
    if (this.required) {
      if (!this.value || !this.value.trim()) {
        this.isRequiredInvalid = true;
        this.feedbackMessage = this.requiredMessage;
      }
    }

    if (this.value && this.pattern) {
      const re = new RegExp(this.pattern);
      if (!re.test(this.value)) {
        this.isPatternInvalid = true;
        this.feedbackMessage = this.patternMessage;
      }
    }
  }
}
