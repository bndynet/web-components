import { LitElement, html, customElement, property } from 'lit-element';

export abstract class RootElement extends LitElement {
  @property({type: String}) public theme = 'primary';
  public createRenderRoot() {
    return this;
  }
}