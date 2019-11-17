import { classMap } from 'lit-html/directives/class-map';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { html, customElement, TemplateResult, property } from 'lit-element';
import { RootElement } from '../../common/RootElement';

const TAG_NAME = 'ui-select-input';

@customElement(TAG_NAME)
export class SelectInput extends RootElement {
  @property({ type: String, reflect: true }) value: string | undefined | null;
  @property({ type: Array, reflect: true }) options = [];
  @property({ type: String, attribute: 'option-template' }) optionTemplate: string | null | undefined;
  @property({ type: String, attribute: 'value-template' }) valueTemplate: string | null | undefined;
  @property({ type: String, attribute: 'value-field' }) valueField: string | undefined;
  @property({ type: String, attribute: 'text-field' }) textField: string | undefined;
  @property({ type: String, attribute: 'disabled-field' }) disabledField: string | undefined;
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean }) required = false;

  private valid = false;
  private invalid = false;
  private showOptions = false;
  private selectedOptionIndex = -1;

  public constructor() {
    super();
  }

  public connectedCallback(): void {
    document.addEventListener('click', evt => {
      if (this.isOutsideEvent(evt)) {
        this.showOptions = false;
        this.requestUpdate();
      }
    });
    super.connectedCallback();
  }

  protected firstUpdated(): void {
    this.selectedOptionIndex = this.options.findIndex((option: any) => {
      if (typeof option !== 'object') {
        return option === this.value;
      } else if (this.valueField) {
        return option[this.valueField] === this.value;
      }
      return false;
    });

    const eleInput = this.querySelector('.form-control');
    if (eleInput) {
      eleInput.addEventListener('click', () => {
        this.showOptions = !this.showOptions;
        this.requestUpdate();
      });
    }

    const eleOption = this.querySelectorAll('.select-option');
    Array.from(eleOption).forEach((element: Element) => {
      element.addEventListener('click', () => {
        if (element.classList.contains('disabled')) {
          return;
        }
        const val = element.getAttribute('value');
        const idx = parseInt(element.getAttribute('data-index') || '-1');
        this.value = val;
        this.showOptions = false;
        this.selectedOptionIndex = idx;
        if (this.required) {
          this.invalid = !this.value;
          this.valid = !!this.value;
        }
        this.requestUpdate();
      });
    });
  }

  protected render(): TemplateResult {
    const eleInputClass = { 'form-control': true, 'is-valid': this.valid, 'is-invalid': this.invalid };
    const eleOptionsClass = { 'select-options': true, active: this.showOptions };
    const valueView =
      this.selectedOptionIndex > -1
        ? this.getHtmlFromTemplate(this.valueTemplate || this.optionTemplate, this.selectedOptionIndex)
        : this.value
        ? html`
            ${this.value}
          `
        : html`
            <span class="placeholder">${this.placeholder}</span>
          `;
    return html`
      <div class="${classMap(eleInputClass)}" tabindex="0">
        ${valueView}
      </div>
      <div class="${classMap(eleOptionsClass)}">
        ${this.options.map((_option: any, index: number) => this.getHtmlFromTemplate(this.optionTemplate, index))}
      </div>
    `;
  }

  private getHtmlFromTemplate(template: string | null | undefined, index: number): TemplateResult {
    const option = this.options[index];
    if (!option) {
      return html``;
    }

    const optionClass: any = {
      'select-option': true,
      disabled: this.disabledField && option[this.disabledField],
    };
    let text = this.formatTemplate(template, option);
    let value = '';
    if (typeof option !== 'object') {
      value = option;
      if (!text) {
        text = option;
      }
    } else {
      if (this.valueField) {
        value = option[this.valueField];
      } else {
        throw new Error(`No value-field attribute found for ${TAG_NAME} element.`);
      }

      if (!text) {
        if (this.textField) {
          text = option[this.textField];
        } else {
          throw new Error(`No text-field attribute found for ${TAG_NAME} element.`);
        }
      }
    }
    optionClass['active'] = value === this.value;
    return html`
      <div class="${classMap(optionClass)}" value="${value}" data-index="${index}">${unsafeHTML(text)}</div>
    `;
  }
}
