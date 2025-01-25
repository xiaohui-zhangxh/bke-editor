import { html, css } from "lit";
import { TiptapEditorBase } from "./TiptapEditorBase";
import { CustomBubbleMenu } from "../editor/extensions/bubble-menu";
import BlockMenu from "../editor/extensions/block-menu";

export class BaklibEditor extends TiptapEditorBase {
  static styles = css`
    :host {
      --bke-bgcolor: white;
      --bke-editing-bgcolor: #f8fafc;
      --bke-border-radius: 3px;
      --bke-border-color: #e2e8f0;
      --bke-border-width: 1px;
      --bke-selected-outline-color: #00000020;

      display: grid;
      grid-template-rows: 1fr;
      height: 100%;
      min-height: 0; /* 重要：允许内容收缩 */
      border: var(--bke-border-width) solid var(--bke-border-color);
      border-radius: var(--bke-border-radius);
      box-sizing: border-box;
    }

    :host:has(bke-toolbar) {
      grid-template-rows: auto 1fr;
    }

    :host:has(bke-status-bar) {
      grid-template-rows: 1fr auto;
    }

    :host:has(bke-toolbar):has(bke-status-bar) {
      grid-template-rows: auto 1fr auto;
    }

    .editor {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow-x: auto;
    }

    .editor ::slotted([slot="editor"]) {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: grid;
      grid-template-rows: 1fr;
      background-color: var(--bke-bgcolor);
    }
  `;

  static properties = {
    ...TiptapEditorBase.properties,
    toolbar: { type: String },
    statusBar: { type: String },
  };

  get baseExtensions() {
    const extensions = super.baseExtensions;
    extensions.push(BlockMenu);
    extensions.push(
      CustomBubbleMenu("customBubbleMenu").configure({
        mode: "text",
        shouldShow: ({ editor }) => {
          // console.log('editor.selection', editor.view.state.selection)
          // console.log('blockquote', editor.isActive("blockquote"))
          return (
            !editor.view.state.selection.empty &&
            !editor.view.state.selection.node &&
            (editor.isActive("paragraph") ||
              editor.isActive("heading") ||
              editor.isActive("blockquote"))
          );
        },
      })
    );
    extensions.push(
      CustomBubbleMenu("imageBubbleMenu").configure({
        pluginKey: "imageBubbleMenu",
        mode: "image",
        shouldShow: ({ editor }) => {
          return editor.isActive("image");
        },
      })
    );
    return extensions;
  }

  render() {
    return html`
      ${this.toolbar
        ? html`
            <bke-toolbar
              part="toolbar"
              .toolbar=${this.toolbar}
              .editor=${this.editor}
            ></bke-toolbar>
          `
        : ""}

      <div class="editor">
        <slot name="editor"></slot>
      </div>

      ${this.statusBar
        ? html`
            <bke-status-bar
              part="status-bar"
              .editor=${this.editor}
            ></bke-status-bar>
          `
        : ""}
    `;
  }
}

customElements.define("bke-editor", BaklibEditor);
