"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

// Convert plain text with line breaks into HTML paragraphs
export function plainTextToHtml(text: string): string {
  if (!text) return "";
  if (/<[a-z][\s\S]*>/i.test(text)) return text;

  return text
    .split("\n")
    .map((line) => `<p>${line || "<br>"}</p>`)
    .join("");
}

// Strip HTML tags for plain text previews
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
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: plainTextToHtml(value),
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] px-3 py-2.5 text-sm text-[#6B4550] outline-none [&_p]:my-0.5 [&_a]:text-[#C4909A] [&_a]:underline",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const incoming = plainTextToHtml(value);
    const current = editor.getHTML();

    if (incoming !== current) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  const handleLinkClick = (): void => {
    const prevHref = editor.getAttributes("link").href;
    const prev = typeof prevHref === "string" ? prevHref : "";

    const url = window.prompt("Enter URL", prev);

    if (url === null) return;

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const href =
      trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")
        ? trimmedUrl
        : `https://${trimmedUrl}`;

    editor.chain().focus().setLink({ href }).run();
  };

  const toolbarBtn = (active: boolean): string =>
    `px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
      active
        ? "bg-[#C4909A]/20 text-[#C4909A]"
        : "text-[#9E7580] hover:text-[#2D1A1F] hover:bg-[#2D1A1F]/10"
    }`;

  return (
    <div className="border border-[#2D1A1F]/10 rounded-xl overflow-hidden bg-[#FAF0E6] focus-within:ring-2 focus-within:ring-[#C4909A]/40">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[#2D1A1F]/10">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={toolbarBtn(editor.isActive("bold"))}
        >
          B
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={toolbarBtn(editor.isActive("italic"))}
        >
          <em>I</em>
        </button>

        <div className="w-px h-3.5 bg-[#2D1A1F]/10 mx-1" />

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleLinkClick();
          }}
          className={toolbarBtn(editor.isActive("link"))}
        >
          Link
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().unsetLink().run();
            }}
            className="px-2.5 py-1 rounded text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            Unlink
          </button>
        )}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}