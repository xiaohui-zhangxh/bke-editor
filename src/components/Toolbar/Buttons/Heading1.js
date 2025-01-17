import { html } from 'lit';
export const icon = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 20H11V13H4V20H2V4H4V11H11V4H13V20ZM21.0005 8V20H19.0005L19 10.204L17 10.74V8.67L19.0005 8H21.0005Z"></path></svg>`;

export const onClick = (editor) => {
  return () => {
    if(editor){
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    }
  }
};
