import { html, css, LitElement } from 'lit';

export class BlockMenu extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      opacity: 0;
      transition: 0.2s ease-out;
      transition-property: opacity, top;
      pointer-events: none;
      z-index: 50;
      border-radius: 4px;
      width: max-content;
    }

    :host([visible]) {
      opacity: 1;
      pointer-events: auto;
    }

    .menu {
      display: flex;
      flex-wrap: nowrap;
      gap: 4px;
    }

    .button {
      border: none;
      background: var(--bke-menu-button-bg, #fff);
      border: 1px solid var(--bke-border-color, #e2e8f0);
      border-radius: 4px;
      cursor: pointer;
      padding: 2px 0px 2px 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--bke-menu-button-color, #64748b);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: all 0.2s;
    }

    .button:hover {
      background: var(--bke-menu-button-hover-bg, #f8fafc);
      color: var(--bke-menu-button-hover-color, #0f172a);
    }

    .button span {
      padding: 2px 4px;
    }
    .button svg {
      width: 16px;
      height: 16px;
    }
  `;

  static properties = {
    editor: { type: Object },
    visible: { type: Boolean, reflect: true },
    nodeType: { type: String },
    nodePos: { type: Number },
  };

  constructor() {
    super();
    this.editor = null;
    this.visible = false;
  }

  #handleAdd() {
    if (!this.editor) return;

    // 在当前块后插入一个新段落
    this.editor.chain()
      .insertContentAfter({ type: 'paragraph' })
      .focus()
      .run();
  }

  #handleDelete() {
    if (!this.editor) return;

    const { state } = this.editor;
    const $pos = state.doc.resolve(this.nodePos + 1)
    console.log("$pos", $pos);
    // debugger
    const from = $pos.start(1) - 1
    const to = $pos.end(1) + 1
    const node = state.doc.nodeAt(this.nodePos)
    console.log('from', from, 'to', to);
    console.log(this.nodePos, this.nodePos + node.content.size)

    // 删除当前块
    console.log('deleteNode', this.nodePos);
    const tr = state.tr.delete(from, to);
    this.editor.view.dispatch(tr)
  }

  render() {
    return html`
      <div class="menu">
        <button class="button" @click=${this.#handleAdd} title="添加块">
          <span>${this.nodeType ? this.nodeType.charAt(0).toUpperCase() : ''}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 7C9.32843 7 10 6.32843 10 5.5C10 4.67157 9.32843 4 8.5 4C7.67157 4 7 4.67157 7 5.5C7 6.32843 7.67157 7 8.5 7ZM8.5 13.5C9.32843 13.5 10 12.8284 10 12C10 11.1716 9.32843 10.5 8.5 10.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5ZM10 18.5C10 19.3284 9.32843 20 8.5 20C7.67157 20 7 19.3284 7 18.5C7 17.6716 7.67157 17 8.5 17C9.32843 17 10 17.6716 10 18.5ZM15.5 7C16.3284 7 17 6.32843 17 5.5C17 4.67157 16.3284 4 15.5 4C14.6716 4 14 4.67157 14 5.5C14 6.32843 14.6716 7 15.5 7ZM17 12C17 12.8284 16.3284 13.5 15.5 13.5C14.6716 13.5 14 12.8284 14 12C14 11.1716 14.6716 10.5 15.5 10.5C16.3284 10.5 17 11.1716 17 12ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"></path></svg>
        </button>
      </div>
    `;
  }
}

customElements.define('bke-block-menu', BlockMenu);
