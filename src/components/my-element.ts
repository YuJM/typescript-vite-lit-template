import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      color: #213547;
    }

    button {
      background-color: #646cff;
      color: white;
      border: none;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      border-radius: 8px;
      transition: background-color 0.25s;
    }

    button:hover {
      background-color: #535bf2;
    }

    .count {
      font-size: 1.5em;
      margin: 1em 0;
    }
  `;

  @property({ type: String })
  name = 'World';

  @property({ type: Number })
  count = 0;

  render() {
    return html`
      <h1>Hello, ${this.name}!</h1>
      <div class="count">Count is ${this.count}</div>
      <button @click=${this._increment}>Increment</button>
      <button @click=${this._decrement}>Decrement</button>
      <button @click=${this._reset}>Reset</button>
    `;
  }

  private _increment() {
    this.count++;
  }

  private _decrement() {
    this.count--;
  }

  private _reset() {
    this.count = 0;
  }
}