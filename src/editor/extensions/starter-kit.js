import TiptapStarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import { Extension } from "@tiptap/core";

export default StarterKit = Extension.create({
  name: "bkeStarterKit",

  addExtensions() {
    const extensions = [
      TiptapStarterKit,
      Underline,
    ];
    return extensions;
  }
});
