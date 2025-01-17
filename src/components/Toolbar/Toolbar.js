import { html, css, LitElement } from 'lit';

export class Toolbar extends LitElement {
  static styles = css`
    :host {
      --bke-toolbar-bgcolor: var(--bke-border-color);
      --bke-toolbar-gap: 4px;
      --bke-toolbar-padding: 2px 4px;
      --bke-toolbar-border-width: var(--bke-border-width);
      --bke-toolbar-border-color: var(--bke-border-color);

      border-bottom: var(--bke-toolbar-border-width) solid var(--bke-toolbar-border-color);
      background-color: var(--bke-toolbar-bgcolor);
      padding: var(--bke-toolbar-padding);
      max-width: 100%;
      overflow: hidden;
    }

    .wrapper slot {
      display: flex;
      gap: var(--bke-toolbar-gap);
      overflow-x: auto;
      min-width: 0;
    }
  `;

  static properties = {
    editor: { type: Object },
    _updateCounter: { type: Number, state: true }
  };

  constructor() {
    super();
    this.editor = null;
    this._updateCounter = 0;
    this._updateHandler = null;
    console.log('toolbar constructor');
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.editor) {
      this._setupEditorListeners();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEditorListeners();
  }

  _setupEditorListeners() {
    if (!this.editor) return;

    this._removeEditorListeners();

    this._updateHandler = () => {
      this._updateCounter++;
      this.requestUpdate();
    };

    this.editor.on('selectionUpdate', this._updateHandler);
    this.editor.on('transaction', this._updateHandler);
    this.editor.on('focus', this._updateHandler);
    this.editor.on('blur', this._updateHandler);
  }

  _removeEditorListeners() {
    if (this._updateHandler && this.editor) {
      this.editor.off('selectionUpdate', this._updateHandler);
      this.editor.off('transaction', this._updateHandler);
      this.editor.off('focus', this._updateHandler);
      this.editor.off('blur', this._updateHandler);
    }
  }

  update(changedProperties) {
    if (changedProperties.has('editor')) {
      if (this.editor) {
        this._setupEditorListeners();
      } else {
        this._removeEditorListeners();
      }
    }
    super.update(changedProperties);
  }

  render() {
    console.log('render toolbar', this._updateCounter);
    return html`
      <div part="wrapper" class="wrapper">
        <slot>
          <bke-toolbar-button .editor=${this.editor} name="undo" .key=${this._updateCounter}></bke-toolbar-button>
          <bke-toolbar-button .editor=${this.editor} name="redo" .key=${this._updateCounter}></bke-toolbar-button>
          <bke-toolbar-gap></bke-toolbar-gap>
          <bke-toolbar-button .editor=${this.editor} name="bold" .key=${this._updateCounter}></bke-toolbar-button>
          <bke-toolbar-button .editor=${this.editor} name="italic" .key=${this._updateCounter}></bke-toolbar-button>
          <bke-toolbar-button .editor=${this.editor} name="underline" .key=${this._updateCounter}></bke-toolbar-button>
          <bke-toolbar-button .editor=${this.editor} name="strike" .key=${this._updateCounter}></bke-toolbar-button>
          <bke-toolbar-button .editor=${this.editor} name="code" .key=${this._updateCounter}></bke-toolbar-button>
          <bke-toolbar-button .editor=${this.editor} name="link" .key=${this._updateCounter}></bke-toolbar-button>
          <bke-toolbar-button .editor=${this.editor} name="image" .key=${this._updateCounter}></bke-toolbar-button>
          <bke-toolbar-button .editor=${this.editor} name="list" .key=${this._updateCounter}></bke-toolbar-button>
          <bke-toolbar-button .editor=${this.editor} name="quote" .key=${this._updateCounter}></bke-toolbar-button>
        </slot>
      </div>
    `;
  }
}

customElements.define('bke-toolbar', Toolbar);
