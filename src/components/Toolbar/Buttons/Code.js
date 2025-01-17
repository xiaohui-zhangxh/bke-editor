import { html } from 'lit';
export const icon = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.95 8.46451L18.3642 7.05029L23.3137 12L18.3642 16.9498L16.95 15.5356L20.4853 12L16.95 8.46451ZM7.05048 8.46451L3.51516 12L7.05048 15.5356L5.63627 16.9498L0.686768 12L5.63627 7.05029L7.05048 8.46451Z"></path></svg>`;

export const onClick = (editor) => {
  return () => {
    if(editor){
      editor.chain().focus().toggleCode().run();
    }
  }
};

export const isActive = (editor) => {
  return editor?.isActive('code');
}
