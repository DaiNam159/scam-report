"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { useCallback, useRef, useEffect, useState } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaHighlighter,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaImage,
  FaLink,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaUndo,
  FaRedo,
  FaMinus,
  FaTable,
  FaPalette,
  FaEraser,
} from "react-icons/fa";
import { toast } from "sonner";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({
  content,
  onChange,
  placeholder = "Viết nội dung bài viết...",
}: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        strike: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Underline,
      Strike,
      Highlight.configure({
        multicolor: true,
      }),
      HorizontalRule,
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    onCreate: ({ editor }) => {
      // Set default text color to black when editor is created
      editor.chain().focus().setColor("#000000").run();
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] px-5 py-4",
      },
    },
  });

  // Sync content when prop changes (for edit mode)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        toast.info("Đang tải ảnh lên...");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        console.log("Upload response:", data);

        if (editor && data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
          toast.success("Đã thêm ảnh thành công");

          // Force trigger onChange
          setTimeout(() => {
            onChange(editor.getHTML());
          }, 100);
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Không thể upload ảnh");
      }
    },
    [editor, onChange]
  );

  const addImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Nhập URL:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="overflow-hidden bg-white border-2 border-indigo-200 shadow-lg rounded-xl">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 border-b-2 border-indigo-200 bg-linear-to-r from-indigo-50 to-blue-50">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive("bold")
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Đậm (Ctrl+B)"
        >
          <FaBold />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive("italic")
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Nghiêng (Ctrl+I)"
        >
          <FaItalic />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive("underline")
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Gạch chân (Ctrl+U)"
        >
          <FaUnderline />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive("strike")
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Gạch ngang"
        >
          <FaStrikethrough />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive("highlight")
              ? "bg-yellow-400 text-gray-900 shadow-md"
              : "bg-white text-gray-700 hover:bg-yellow-100"
          }`}
          title="Làm nổi bật"
        >
          <FaHighlighter />
        </button>

        {/* Text Color */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 text-gray-700 transition-all duration-200 bg-white rounded-lg hover:bg-indigo-100"
            title="Màu chữ"
          >
            <FaPalette />
          </button>
          {showColorPicker && (
            <div className="absolute z-10 flex gap-1 p-2 mt-1 bg-white border-2 border-indigo-200 rounded-lg shadow-xl top-full">
              {[
                "#000000",
                "#e53935",
                "#1e88e5",
                "#43a047",
                "#fb8c00",
                "#8e24aa",
                "#f4511e",
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 transition-colors border-2 border-gray-300 rounded hover:border-indigo-500"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="flex items-center justify-center w-6 h-6 transition-colors bg-white border-2 border-gray-300 rounded hover:border-indigo-500"
                title="Xóa màu"
              >
                <FaEraser className="text-xs" />
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-8 mx-1 bg-indigo-200"></div>

        {/* Headings */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-2 rounded-lg font-bold transition-all duration-200 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Tiêu đề 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-2 rounded-lg font-bold transition-all duration-200 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Tiêu đề 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-3 py-2 rounded-lg font-bold transition-all duration-200 ${
            editor.isActive("heading", { level: 3 })
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Tiêu đề 3"
        >
          H3
        </button>

        <div className="w-px h-8 mx-1 bg-indigo-200"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive("bulletList")
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Danh sách"
        >
          <FaListUl />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive("orderedList")
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Danh sách đánh số"
        >
          <FaListOl />
        </button>

        <div className="w-px h-8 mx-1 bg-indigo-200"></div>

        {/* Quote & Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive("blockquote")
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Trích dẫn"
        >
          <FaQuoteLeft />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive("codeBlock")
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Code"
        >
          <FaCode />
        </button>

        <div className="w-px h-8 mx-1 bg-indigo-200"></div>

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive({ textAlign: "left" })
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Căn trái"
        >
          <FaAlignLeft />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive({ textAlign: "center" })
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Căn giữa"
        >
          <FaAlignCenter />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive({ textAlign: "right" })
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Căn phải"
        >
          <FaAlignRight />
        </button>

        <div className="w-px h-8 mx-1 bg-indigo-200"></div>

        {/* Link & Image */}
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive("link")
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-blue-100"
          }`}
          title="Thêm link"
        >
          <FaLink />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 text-gray-700 transition-all duration-200 bg-white rounded-lg hover:bg-green-100"
          title="Thêm ảnh"
        >
          <FaImage />
        </button>

        <div className="w-px h-8 mx-1 bg-indigo-200"></div>

        {/* Horizontal Rule & Table */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 text-gray-700 transition-all duration-200 bg-white rounded-lg hover:bg-indigo-100"
          title="Đường kẻ ngang"
        >
          <FaMinus />
        </button>
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive("table")
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-indigo-100"
          }`}
          title="Thêm bảng (3x3)"
        >
          <FaTable />
        </button>

        <div className="w-px h-8 mx-1 bg-indigo-200"></div>

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 text-gray-700 transition-all duration-200 bg-white rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Hoàn tác (Ctrl+Z)"
        >
          <FaUndo />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 text-gray-700 transition-all duration-200 bg-white rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Làm lại (Ctrl+Y)"
        >
          <FaRedo />
        </button>
      </div>

      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            uploadImage(file);
          }
          e.target.value = "";
        }}
      />
    </div>
  );
}
