import { html, css, LitElement } from "lit";

export default class BubbleMenu extends LitElement {
  static styles = css`
    :host {
      position: absolute;
    }
    .bubble-menu {
      background-color: #fff;
      border: 1px solid #ccc;
      padding: 2px 4px;
      border-radius: 4px;
    }
    .bubble-menu-item {
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 4px;
    }
    .bubble-menu-item:hover {
      background-color: #f0f0f0;
    }
  `;

  static properties = {
    mode: { type: String },
    editor: { type: Object },
  };

  render() {
    return html`<div class="bubble-menu">BubbleMenu: ${this.mode}</div>`;
  }
}

customElements.define("bke-bubble-menu", BubbleMenu);
