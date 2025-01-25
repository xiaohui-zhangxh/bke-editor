import {
  arrow, autoPlacement, computePosition, flip, hide, inline, offset, shift,
  size,
} from '@floating-ui/dom'
import {
  Editor, isTextSelection, posToDOMRect,
} from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export class BubbleMenuView {
  constructor({
    editor,
    element,
    view,
    updateDelay = 250,
    resizeDelay = 60,
    shouldShow,
    options,
  }) {
    this.editor = editor
    this.element = element
    this.view = view
    this.preventHide = false
    this.updateDelay = updateDelay
    this.resizeDelay = resizeDelay
    this.updateDebounceTimer = undefined
    this.resizeDebounceTimer = undefined

    this.floatingUIOptions = {
      strategy: 'absolute',
      placement: 'top',
      offset: 8,
      // flip: {},
      // shift: {},
      arrow: false,
      size: false,
      autoPlacement: false,
      hide: false,
      inline: false,
    }

    this.floatingUIOptions = {
      ...this.floatingUIOptions,
      ...options,
    }

    if (shouldShow) {
      this.shouldShow = shouldShow
    }

    this.element.addEventListener('mousedown', this.mousedownHandler, { capture: true })
    this.view.dom.addEventListener('dragstart', this.dragstartHandler)
    this.editor.on('focus', this.focusHandler)
    this.editor.on('blur', this.blurHandler)
    window.addEventListener('resize', () => {
      if (this.resizeDebounceTimer) {
        clearTimeout(this.resizeDebounceTimer)
      }

      this.resizeDebounceTimer = window.setTimeout(() => {
        this.updatePosition()
      }, this.resizeDelay)
    })

    this.update(view, view.state)

    if (this.getShouldShow()) {
      this.show()
    }
  }

  shouldShow = ({
    view,
    state,
    from,
    to,
  }) => {
    const { doc, selection } = state
    const { empty } = selection

    const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(state.selection)
    const isChildOfMenu = this.element.contains(document.activeElement)
    const hasEditorFocus = view.hasFocus() || isChildOfMenu

    if (!hasEditorFocus || empty || isEmptyTextBlock || !this.editor.isEditable) {
      return false
    }

    return true
  }

  get middlewares() {
    const middlewares = []

    if (this.floatingUIOptions.flip) {
      middlewares.push(flip(typeof this.floatingUIOptions.flip !== 'boolean' ? this.floatingUIOptions.flip : undefined))
    }

    if (this.floatingUIOptions.shift) {
      middlewares.push(shift(typeof this.floatingUIOptions.shift !== 'boolean' ? this.floatingUIOptions.shift : undefined))
    }

    if (this.floatingUIOptions.offset) {
      middlewares.push(offset(typeof this.floatingUIOptions.offset !== 'boolean' ? this.floatingUIOptions.offset : undefined))
    }

    if (this.floatingUIOptions.arrow) {
      middlewares.push(arrow(this.floatingUIOptions.arrow))
    }

    if (this.floatingUIOptions.size) {
      middlewares.push(size(typeof this.floatingUIOptions.size !== 'boolean' ? this.floatingUIOptions.size : undefined))
    }

    if (this.floatingUIOptions.autoPlacement) {
      middlewares.push(autoPlacement(typeof this.floatingUIOptions.autoPlacement !== 'boolean' ? this.floatingUIOptions.autoPlacement : undefined))
    }

    if (this.floatingUIOptions.hide) {
      middlewares.push(hide(typeof this.floatingUIOptions.hide !== 'boolean' ? this.floatingUIOptions.hide : undefined))
    }

    if (this.floatingUIOptions.inline) {
      middlewares.push(inline(typeof this.floatingUIOptions.inline !== 'boolean' ? this.floatingUIOptions.inline : undefined))
    }

    return middlewares
  }

  mousedownHandler = () => {
    this.preventHide = true
  }

  dragstartHandler = () => {
    this.hide()
  }

  focusHandler = () => {
    setTimeout(() => this.update(this.editor.view))
  }

  blurHandler = ({ event }) => {
    if (this.preventHide) {
      this.preventHide = false
      return
    }

    if (event?.relatedTarget && this.element.parentNode?.contains(event.relatedTarget)) {
      return
    }

    this.hide()
  }

  updatePosition() {
    const { selection } = this.editor.state

    const virtualElement = {
      getBoundingClientRect: () => posToDOMRect(this.view, selection.from, selection.to),
    }

    computePosition(virtualElement, this.element, {
      placement: this.floatingUIOptions.placement,
      strategy: this.floatingUIOptions.strategy,
      middleware: this.middlewares
    }).then(({ x, y, strategy }) => {
      this.element.style.width = 'max-content'
      this.element.style.position = strategy
      this.element.style.left = `${x}px`
      this.element.style.top = `${y}px`
    })
  }

  update(view, oldState) {
    const { state } = view
    const hasValidSelection = state.selection.from !== state.selection.to

    if (this.updateDelay > 0 && hasValidSelection) {
      this.handleDebouncedUpdate(view, oldState)
      return
    }

    const selectionChanged = !oldState?.selection.eq(view.state.selection)
    const docChanged = !oldState?.doc.eq(view.state.doc)

    this.updateHandler(view, selectionChanged, docChanged, oldState)
  }

  handleDebouncedUpdate = (view, oldState) => {
    const selectionChanged = !oldState?.selection.eq(view.state.selection)
    const docChanged = !oldState?.doc.eq(view.state.doc)

    if (!selectionChanged && !docChanged) {
      return
    }

    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer)
    }

    this.updateDebounceTimer = window.setTimeout(() => {
      this.updateHandler(view, selectionChanged, docChanged, oldState)
    }, this.updateDelay)
  }

  getShouldShow(oldState) {
    const { state } = this.view
    const { selection } = state

    const { ranges } = selection
    const from = Math.min(...ranges.map(range => range.$from.pos))
    const to = Math.max(...ranges.map(range => range.$to.pos))

    return this.shouldShow?.({
      editor: this.editor,
      view: this.view,
      state,
      oldState,
      from,
      to,
    })
  }

  updateHandler = (view, selectionChanged, docChanged, oldState) => {
    const { composing } = view
    const isSame = !selectionChanged && !docChanged

    if (composing || isSame) {
      return
    }

    const shouldShow = this.getShouldShow(oldState)

    if (!shouldShow) {
      this.hide()
      return
    }

    this.updatePosition()
    this.show()
  }

  show() {
    this.element.style.visibility = 'visible'
    this.element.style.opacity = '1'
    document.body.appendChild(this.element)
  }

  hide() {
    this.element.style.visibility = 'hidden'
    this.element.style.opacity = '0'
    this.element.remove()
  }

  destroy() {
    this.hide()
    this.element.removeEventListener('mousedown', this.mousedownHandler, { capture: true })
    this.view.dom.removeEventListener('dragstart', this.dragstartHandler)
    this.editor.off('focus', this.focusHandler)
    this.editor.off('blur', this.blurHandler)
  }
}

export const BubbleMenuPlugin = (options) => {
  return new Plugin({
    key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: view => new BubbleMenuView({ view, ...options }),
  })
}
