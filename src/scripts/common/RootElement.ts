import { LitElement, html, customElement, property } from 'lit-element';

export abstract class RootElement extends LitElement {
  @property({type: String}) public theme = 'primary';

  public constructor() {
    super();
  }

  public createRenderRoot() {
    return this;
  }

  protected fillParent() {
    if (this.parentElement) {
      const paddingTop = this.parentElement.offsetParent;
      const width = this.parentElement.clientWidth;
      const height = this.parentElement.clientHeight;
      this.setAttribute('style', `position: absolute; display: flex; background-color: #000; opacity: 0.5; align-items: center; justify-content: center; width: ${width}px; height: ${height}px`);
    }
  }
}