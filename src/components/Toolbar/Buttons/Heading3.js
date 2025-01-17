import { html } from 'lit';
export const icon = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 8L21.9984 10.1425C21.9357 10.0498 21.8671 9.96106 21.7924 9.87683L21.6343 9.71427C20.8225 8.94535 19.7369 8.5 18.5 8.5C16.567 8.5 15 10.067 15 12C15 13.933 16.567 15.5 18.5 15.5C19.3276 15.5 20.0974 15.2658 20.7454 14.8524L20.9914 14.6722L22 16.0385C21.0057 16.9775 19.8094 17.5 18.5 17.5C15.4624 17.5 13 15.0376 13 12C13 8.96243 15.4624 6.5 18.5 6.5C19.8299 6.5 21.0423 7.03556 22 7.99539V8ZM4 4V11H11V4H13V20H11V13H4V20H2V4H4Z"></path></svg>`;

export const onClick = (editor) => {
  return () => {
    if(editor){
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }
  }
};
