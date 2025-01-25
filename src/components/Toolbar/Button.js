import { html, css, LitElement } from 'lit';
import * as Buttons from './Buttons';
import { classMap } from 'lit/directives/class-map.js';

function getButton(name) {
  const key = Object.keys(Buttons).find(key => key.toLowerCase() === name.toLowerCase());
  return key ? Buttons[key] : null;
}

export class Button extends LitElement {
  static styles = css`
    :host {
      --bke-toolbar-button-border-color: #f7fafc;
      --bke-toolbar-button-border-radius: 4px;
      --bke-toolbar-button-padding: 4px 6px;
      --bke-toolbar-button-bgcolor: #f7fafc;
      --bke-toolbar-button-color: #4a5568;
      --bke-toolbar-button-hover-bgcolor: #2a2a2a;
      --bke-toolbar-button-hover-color: #fff;
      --bke-toolbar-button-active-bgcolor: #e2e8f0;
      --bke-toolbar-button-active-color: #4a5568;

      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--bke-toolbar-button-border-color);
      border-radius: var(--bke-toolbar-button-border-radius);
      padding: var(--bke-toolbar-button-padding);
      background-color: var(--bke-toolbar-button-bgcolor);
      color: var(--bke-toolbar-button-color);
      transition: background-color, border-color, color 0.3s ease;
      cursor: pointer;
      user-select: none;
      outline: none;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
    }

    :host(:hover) {
      background-color: var(--bke-toolbar-button-hover-bgcolor);
      color: var(--bke-toolbar-button-hover-color);
      border-color: var(--bke-toolbar-button-hover-bgcolor);
    }

    :host(:active) {
      background-color: var(--bke-toolbar-button-active-bgcolor);
      color: var(--bke-toolbar-button-active-color);
      border-color: var(--bke-toolbar-button-active-bgcolor);
    }

    slot > svg {
      width: 16px;
      height: 16px;
    }

    :host:has(.active) {
      background-color: var(--bke-toolbar-button-hover-bgcolor);
      color: var(--bke-toolbar-button-hover-color);
      border-color: var(--bke-toolbar-button-hover-bgcolor);
    }
  `;

  static properties = {
    name: { type: String, reflect: true },
    editor: { type: Object },
    key: { type: Number, state: true }
  };

  render() {
    const button = getButton(this.name)
    const classes = {
      'active': button?.isActive?.(this.editor) || false
    }
    if (button) {
      return html`<slot name="bke-toolbar-button-${this.name}" class=${classMap(classes)} @click=${button.onClick(this.editor)}>${button.icon}</slot>`
    }else{
      return html`<slot>${this.name}</slot>`
    }
  }
}

customElements.define('bke-toolbar-button', Button);
