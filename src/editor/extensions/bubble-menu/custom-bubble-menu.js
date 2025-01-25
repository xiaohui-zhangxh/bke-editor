import { Extension } from '@tiptap/core'
import { BubbleMenuPlugin } from './bubble-menu-plugin.js'
import { PluginKey } from '@tiptap/pm/state'
export const CustomBubbleMenu = (name) => Extension.create({
  name: name || 'customBubbleMenu',

  addOptions() {
    return {
      pluginKey: 'bubbleMenu',
      updateDelay: undefined,
      shouldShow: null,
      mode: "text",
    }
  },

  addProseMirrorPlugins() {
    const element = document.createElement("bke-bubble-menu");
    element.editor = this.editor;
    element.mode = this.options.mode;
    element.style.position = "absolute";
    element.style.visibility = "hidden";
    document.body.appendChild(element);
    element.remove();
    console.log('element', element);

    return [
      BubbleMenuPlugin({
        editor: this.editor,
        key: new PluginKey(this.options.pluginKey || "bubbleMenu"),
        element: element,
        shouldShow: this.options.shouldShow
      }),
    ]
  },
})
