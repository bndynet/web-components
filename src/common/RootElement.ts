import { LitElement, property } from 'lit-element';
import { getElementStyle } from '../utils';

export abstract class RootElement extends LitElement {
  @property({ type: String }) public theme = '';

  public constructor() {
    super();
  }

  public createRenderRoot(): RootElement {
    return this;
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
}
