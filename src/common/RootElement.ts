import { Part, AttributePart } from 'lit-html';
import { LitElement, html, property, TemplateResult } from 'lit-element';
import { directive } from 'lit-html/lib/directive';
import { getElementStyle } from '../utils';

export abstract class RootElement extends LitElement {
  @property({ type: String }) public theme = '';

  public constructor() {
    super();
  }

  protected createRenderRoot(): RootElement {
    return this;
  }

  protected ifShowHtml(expresion: boolean, htmlTemplate: TemplateResult): TemplateResult {
    if (expresion) {
      return htmlTemplate;
    }
    return html``;
  }

  protected ifShowAttribute(expression: boolean, attr: string, attrValue: string): string {
    if (expression) {
      return `${attr}="${attrValue}"`;
    }
    return '';
  }

  protected fillParent(attachStyles?: string): void {
    if (this.parentElement) {
      this.parentElement.style.position = 'relative';
      const parentPaddingTop = getElementStyle(this.parentElement, 'padding-top');
      const parentPaddingLeft = getElementStyle(this.parentElement, 'padding-left');
      const parentBorderRadius = getElementStyle(this.parentElement, 'border-radius');
      const originStyle = this.getAttribute('style') ? this.getAttribute('style') + ';' : '';
      attachStyles = attachStyles ? attachStyles + ';' : '';
      const style = `position: absolute;
        display: flex;
        margin-left: -${parentPaddingLeft};
        margin-top: -${parentPaddingTop};
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: ${parentBorderRadius};
      `;
      this.setAttribute('style', originStyle + style + attachStyles);
    }
  }

  protected ifAttr = directive((expression: boolean, attrValue: string) => (part: Part): void => {
    if (!expression && part instanceof AttributePart) {
      const name = part.committer.name;
      part.committer.element.removeAttribute(name);
    } else {
      part.setValue(attrValue);
    }
  });

  protected isOutsideEvent(evt: Event): boolean {
    let targetElement = evt.target;

    while (targetElement) {
      if (targetElement == this) {
        return false;
      }
      targetElement = (targetElement as HTMLElement).parentNode;
    }
    return true;
  }

  protected removeChildren(element: Element): void {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  protected formatTemplate(template: string | undefined | null, value: any): string {
    if (!template) {
      return '';
    }

    if (typeof value !== 'object') {
      return template.replace(/\{0\}/g, value);
    } else {
      let result = template;
      Object.keys(value).forEach((key: string) => {
        result = result!.replace(new RegExp(`{${key}}`, 'g'), value[key]);
      });
      return result;
    }
  }
}
