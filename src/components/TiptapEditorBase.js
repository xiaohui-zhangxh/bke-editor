import { LitElement } from 'lit';
import { Editor } from '@tiptap/core';
import StarterKit from '../editor/extensions/starter-kit';
export class TiptapEditorBase extends LitElement {
  static properties = {
    content: { type: String },
    readonly: { type: Boolean },
    autofocus: { type: Boolean },
    class: { type: String },
    extensions: { type: Array },
    format: { type: String },
    maxWordCount: { type: Number },
  };

  constructor() {
    super();
    this.content = '';
    this.readonly = false;
    this.autofocus = false;
    this.class = '';
    this.extensions = [];
    this.format = 'html';
    this.maxWordCount = 1000;
  }

  firstUpdated() {
    this.#buildEditor();
  }

  get baseExtensions() {
    return [StarterKit];
  }

  get editorDefaultOptions() {
    return {
      element: this.#editorElement,
      editable: !this.readonly,
      autofocus: this.autofocus && !this.readonly,
      extensions: this.baseExtensions.concat(this.extensions),
      content: this.format === "json" ? JSON.parse(this.content) : this.content,
      editorProps: {
        maxWordCount: this.maxWordCount,
        attributes: {
          class: this.class
        },
      },
      onCreate: () => {
      },
      onUpdate: () => {
        this.emitChange();
      },
      onSelectionUpdate: () => {
      },
    };
  }

  emit(event, data) {
    this.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  emitChange() {
    this.emit('change', { editor: this.editor });
  }

  get #editorElement() {
    let element = this.shadowRoot.host.querySelector('.bke-editor-container');
    if(!element) {
      element = document.createElement('div');
      element.classList.add('bke-editor-container');
      element.slot = 'editor';
      this.shadowRoot.host.appendChild(element);
    }
    return element;
  }

  #buildEditor() {
    console.log('bke-editor', 'buildEditor');
    this.editor = new Editor(this.editorDefaultOptions);
    this.requestUpdate();
  }
}
