"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

// Convert plain text (with \n) to HTML paragraphs for initial load of legacy descriptions
export function plainTextToHtml(text: string): string {
  if (!text) return "";
  if (/<[a-z][\s\S]*>/i.test(text)) return text; // already HTML
  return text
    .split("\n")
    .map((line) => `<p>${line || "<br>"}</p>`)
    .join("");
}

// Strip HTML tags to get plain text for card previews
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: plainTextToHtml(value),
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] px-3 py-2.5 text-sm text-slate-300 outline-none [&_p]:my-0.5 [&_a]:text-[#45c97a] [&_a]:underline",
      },
    },
  });

  // Sync when initialData loads asynchronously (edit page)
  useEffect(() => {
    if (!editor) return;
    const incoming = plainTextToHtml(value);
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  function handleLinkClick() {
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Enter URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      const href = url.startsWith("http") ? url : `https://${url}`;
      editor.chain().focus().setLink({ href }).run();
    }
  }

  const toolbarBtn = (active: boolean) =>
    `px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
      active
        ? "bg-[#45c97a]/20 text-[#45c97a]"
        : "text-slate-400 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-[#091624] focus-within:ring-2 focus-within:ring-[#45c97a]/40">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-white/10">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          className={toolbarBtn(editor.isActive("bold"))}
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          className={toolbarBtn(editor.isActive("italic"))}
        >
          <em>I</em>
        </button>
        <div className="w-px h-3.5 bg-white/10 mx-1" />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleLinkClick(); }}
          className={toolbarBtn(editor.isActive("link"))}
        >
          Link
        </button>
        {editor.isActive("link") && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetLink().run(); }}
            className="px-2.5 py-1 rounded text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
          >
            Unlink
          </button>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
