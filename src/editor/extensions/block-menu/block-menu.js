import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import {computePosition, offset as offsetMiddleware} from '@floating-ui/dom';

function findMenu(view){
  return view.dom.parentElement.querySelector('bke-block-menu');
}
export const BlockMenu = Extension.create({
  name: "blockMenu",

  addOptions() {
    return {
      tippyOptions: {},
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('blockMenu'),
        view: (view) => {
          const container = view.dom.parentElement;
          const menu = document.createElement('bke-block-menu');
          menu.editor = this.editor;
          container.appendChild(menu);
          return {
            destroy: () => {
              container.removeChild(menu);
            },
            update: (view, oldState, newState, oldPlugin, newPlugin) => {
              // console.log('view update', view, oldState, newState, oldPlugin, newPlugin);
            },
          }
        },
        props: {
          handleDOMEvents: {
            mousemove: (view, event) => {
              const menu = findMenu(view)
              if(!menu) {
                return false;
              }
              const pos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });
              if (!pos) {
                menu.visible = false;
                return false;
              }
              // console.log('pos', pos);
              const $pos = view.state.doc.resolve(pos.pos)
              const menuPos = $pos.start(1) - 1
              if(menu.nodePos === menuPos) {
                return false;
              }

              menu.nodePos = menuPos;
              const dom = view.nodeDOM(menuPos)
              // 只在块级节点上显示菜单
              if (dom) {
                  const node = view.state.doc.nodeAt(menuPos)
                  menu.nodeType = node.type.name
                  menu.nodePos = menuPos
                  computePosition(dom, menu, {
                    placement: "left-start",
                    middleware: [offsetMiddleware({crossAxis: 0, mainAxis: 4})],
                  }).then(({x, y}) => {
                    Object.assign(menu.style, {
                      left: `${x}px`,
                      top: `${y}px`,
                    });
                  });
                  menu.visible = true;
              } else {
                menu.visible = false;
              }

              return false;
            },

            keyup: (view, event) => {
              const menu = findMenu(view)
              menu.visible = false;
              return false;
            }
          },
        },
      }),
    ];
  },
});
