import { html } from 'lit';
export const icon = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z"></path></svg>`;

export const onClick = (editor) => {
  return () => {
    if(editor){
      editor.chain().focus().toggleItalic().run();
    }
  }
};

export const isActive = (editor) => {
  return editor?.isActive('italic');
}
