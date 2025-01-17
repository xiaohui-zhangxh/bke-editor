import { html, css, LitElement } from 'lit';

export class StatusBar extends LitElement {
  static styles = css`
    :host {
      --bke-status-bar-bgcolor: #f7fafc;
      --bke-status-bar-color: #4a5568;
      --bke-status-bar-border-color: var(--bke-border-color, #e2e8f0);
      --bke-status-bar-border-radius: var(--bke-border-radius, 4px);
      --bke-status-bar-padding: 2px 4px;
      --bke-status-bar-font-size: 12px;
      --bke-status-bar-min-height: 20px;
      --bke-status-bar-border-width: var(--bke-border-width, 1px);

      background-color: var(--bke-status-bar-bgcolor);
      border-top: var(--bke-status-bar-border-width) solid var(--bke-status-bar-border-color);
      border-bottom-left-radius: var(--bke-status-bar-border-radius);
      border-bottom-right-radius: var(--bke-status-bar-border-radius);
      color: var(--bke-status-bar-color);
      padding: var(--bke-status-bar-padding);
      font-size: var(--bke-status-bar-font-size);
      box-sizing: border-box;
      overflow: hidden;
      min-height: var(--bke-status-bar-min-height);
    }

    .exceeded {
      color: red;
    }
  `;

  static properties = {
    editor: { type: Object },
    maxWordCount: { type: Number, state: true },
  };

  constructor() {
    super();
    this.wordCount = 0;
    this.maxWordCount = 0;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('editor') && this.editor) {
      if(this._editorUpdateHandler) {
        this.editor.off('update', this._editorUpdateHandler);
      }
      this._editorUpdateHandler = this.editor.on('update', () => {
        this.updateWordCount();
      });
      this.updateWordCount();
    }
  }

  updateWordCount() {
    if (!this.editor) return;
    const text = this.editor.getText();
    this.wordCount = text.replace(/\s+/g, '').length;
    this.maxWordCount = this.editor.options.editorProps.maxWordCount;
    this.requestUpdate();
  }

  render() {
    const exceeded = this.wordCount > this.maxWordCount;
    return html`<div part="status-bar" class="status-bar">
      字数: <span class=${exceeded ? 'exceeded' : ''}>${this.wordCount}${this.maxWordCount ? html`/${this.maxWordCount}` : ''}</span>
    </div>`;
  }
}

customElements.define('bke-status-bar', StatusBar);
