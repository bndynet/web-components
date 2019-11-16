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
}
