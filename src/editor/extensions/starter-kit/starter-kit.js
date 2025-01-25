import TiptapStarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";

import { Extension } from "@tiptap/core";

export default StarterKit = Extension.create({
  name: "bkeStarterKit",

  addExtensions() {
    const extensions = [
      TiptapStarterKit,
      Underline,
      Image.configure({
        inline: true,
      })
    ];
    return extensions;
  }
});
