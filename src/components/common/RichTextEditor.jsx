import { useRef, useState, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Link2Off,
  ImagePlus,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Eraser,
  Loader2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

/**
 * Rich-text editor for blog content.
 *
 * Built on a contentEditable surface + document.execCommand rather than an
 * editor dependency, so it ships with the existing bundle and produces plain
 * semantic HTML (h2/h3/p/ul/ol/blockquote/pre/img/a) — which is exactly what
 * the backend sanitiser allows through and what the public article page
 * renders.
 *
 * Images upload straight to S3 with the same presigned-URL flow as
 * FileUploadPreview, and the returned public URL is inserted inline.
 *
 * @param {string}   value        HTML string (controlled)
 * @param {function} onChange     Receives the new HTML on every edit
 * @param {string}   label
 * @param {string}   placeholder
 * @param {string}   error        Validation message
 * @param {string}   folder       S3 sub-folder for inline images
 * @param {number}   minHeight    Editor min height in px
 */
const RichTextEditor = ({
  value = "",
  onChange,
  label,
  placeholder = "Write your story…",
  error,
  folder = "blog/content",
  minHeight = 420,
  disabled = false,
}) => {
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  // Last HTML we pushed upward — lets us skip re-writing innerHTML on our own
  // updates, which would otherwise reset the caret to the start on every key.
  const lastHtmlRef = useRef(value);
  const savedRangeRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [sourceDraft, setSourceDraft] = useState("");
  const [linkModal, setLinkModal] = useState(null); // { url, text, newTab }
  const [imageUrlModal, setImageUrlModal] = useState(null); // { url, alt }
  const [activeFormats, setActiveFormats] = useState({});
  const [stats, setStats] = useState({ words: 0, minutes: 0 });

  // ─── Editor defaults ───────────────────────────────────────────
  useEffect(() => {
    // Emit semantic tags (<b>, <i>) instead of style-carrying <span>s, and
    // wrap new blocks in <p> rather than <div>. Both are best-effort: browsers
    // that reject the command simply keep their defaults.
    try {
      document.execCommand("styleWithCSS", false, false);
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {
      // Not supported — the sanitiser cleans up either way.
    }
  }, []);

  // ─── Sync external value → editor ──────────────────────────────
  useEffect(() => {
    if (showSource) return;
    const el = editorRef.current;
    if (!el) return;

    if (value !== lastHtmlRef.current) {
      // An empty contentEditable has no block to type into, so the first
      // characters would land in a bare text node outside any <p>.
      el.innerHTML = value || "<p><br></p>";
      lastHtmlRef.current = value || "";
      recalcStats(el.innerText || "");
    }
  }, [value, showSource]);

  // Seed the very first render — the sync effect above is a no-op when the
  // incoming value already matches lastHtmlRef (both "" on a new post).
  useEffect(() => {
    const el = editorRef.current;
    if (el && !el.innerHTML) el.innerHTML = "<p><br></p>";
  }, []);

  const recalcStats = (text) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setStats({ words, minutes: Math.max(1, Math.ceil(words / 200)) });
  };

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;

    // An "empty" contentEditable still holds <br> / empty <p> noise — normalise
    // it to "" so `required` validation behaves.
    const html = el.innerHTML;
    const isBlank = el.textContent.trim() === "" && !html.includes("<img");
    const next = isBlank ? "" : html;

    lastHtmlRef.current = next;
    recalcStats(el.innerText || "");
    onChange?.(next);
  }, [onChange]);

  // ─── Selection helpers ─────────────────────────────────────────
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const range = savedRangeRef.current;
    editorRef.current?.focus();
    if (!range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const refreshActiveFormats = () => {
    if (!editorRef.current) return;
    const check = (cmd) => {
      try {
        return document.queryCommandState(cmd);
      } catch {
        return false;
      }
    };
    let block = "p";
    try {
      block = (document.queryCommandValue("formatBlock") || "p").toLowerCase();
    } catch {
      block = "p";
    }
    setActiveFormats({
      bold: check("bold"),
      italic: check("italic"),
      underline: check("underline"),
      strikeThrough: check("strikeThrough"),
      insertUnorderedList: check("insertUnorderedList"),
      insertOrderedList: check("insertOrderedList"),
      block,
    });
  };

  const exec = (command, arg = null) => {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    refreshActiveFormats();
    emit();
  };

  const applyBlock = (tag) => exec("formatBlock", `<${tag}>`);

  // ─── Paste: strip Word/Docs markup, keep the text ──────────────
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    emit();
  };

  // Enter inside a blockquote/pre should escape back to a paragraph on the
  // second press, which is what authors expect.
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      exec(e.shiftKey ? "outdent" : "indent");
    }
  };

  // ─── Inline image upload ───────────────────────────────────────
  const insertHtmlAtCursor = (html) => {
    restoreSelection();
    document.execCommand("insertHTML", false, html);
    emit();
  };

  const escapeAttr = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const uploadImage = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Max 5MB.");
      return;
    }

    setUploading(true);
    try {
      const contentType = file.type || "application/octet-stream";

      const presignRes = await api.post("/s3/presigned-url", {
        filename: file.name,
        content_type: contentType,
        folder,
      });

      const payload = presignRes?.data ?? presignRes;
      const presignedUrl = payload?.presigned_url;
      const publicUrl = payload?.public_url;

      if (!presignedUrl || !publicUrl) {
        throw new Error("Server did not return a valid presigned URL");
      }

      // Raw PUT to S3 — no auth header, body is the file itself.
      const s3Res = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
      });

      if (!s3Res.ok) throw new Error(`S3 upload failed (${s3Res.status})`);

      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      insertHtmlAtCursor(
        `<figure><img src="${escapeAttr(publicUrl)}" alt="${escapeAttr(alt)}" loading="lazy" /><figcaption>${escapeAttr(alt)}</figcaption></figure><p><br></p>`,
      );
      toast.success("Image inserted");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // ─── Link handling ─────────────────────────────────────────────
  const openLinkModal = () => {
    saveSelection();
    const selected = window.getSelection()?.toString() || "";
    setLinkModal({ url: "", text: selected, newTab: true });
  };

  const applyLink = () => {
    if (!linkModal?.url) return;

    const url = linkModal.url.trim();
    const safe = /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : `https://${url}`;
    const rel = linkModal.newTab ? ' target="_blank" rel="noopener noreferrer"' : "";
    const text = linkModal.text?.trim() || safe;

    insertHtmlAtCursor(`<a href="${escapeAttr(safe)}"${rel}>${escapeAttr(text)}</a>`);
    setLinkModal(null);
  };

  const applyImageUrl = () => {
    if (!imageUrlModal?.url) return;
    const url = imageUrlModal.url.trim();
    const alt = imageUrlModal.alt?.trim() || "";
    insertHtmlAtCursor(
      `<figure><img src="${escapeAttr(url)}" alt="${escapeAttr(alt)}" loading="lazy" />${alt ? `<figcaption>${escapeAttr(alt)}</figcaption>` : ""}</figure><p><br></p>`,
    );
    setImageUrlModal(null);
  };

  // ─── Source view ───────────────────────────────────────────────
  const toggleSource = () => {
    if (showSource) {
      lastHtmlRef.current = sourceDraft;
      onChange?.(sourceDraft);
      setShowSource(false);
      // Force the sync effect to repaint the editor surface.
      requestAnimationFrame(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = sourceDraft || "";
          recalcStats(editorRef.current.innerText || "");
        }
      });
    } else {
      setSourceDraft(editorRef.current?.innerHTML || value || "");
      setShowSource(true);
    }
  };

  // ─── Toolbar definitions ───────────────────────────────────────
  const BLOCK_OPTIONS = [
    { value: "p", label: "Paragraph" },
    { value: "h2", label: "Heading 2" },
    { value: "h3", label: "Heading 3" },
    { value: "h4", label: "Heading 4" },
  ];

  const ToolButton = ({ icon: Icon, onClick, title, active, disabled: btnDisabled }) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active ? "true" : "false"}
      // onMouseDown keeps the editor selection alive — a click would blur it first.
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled || btnDisabled}
      className={`p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active
          ? "bg-purple-100 text-purple-700"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
    </button>
  );

  const Divider = () => <span className="w-px h-6 bg-slate-200 mx-0.5" />;

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      <div
        className={`rounded-xl border-2 overflow-hidden bg-white transition-colors ${
          error ? "border-red-300" : "border-slate-200 focus-within:border-purple-400"
        }`}
      >
        {/* ─── Toolbar ─────────────────────────────────────── */}
        <div className="flex items-center gap-0.5 flex-wrap px-2 py-2 border-b border-slate-200 bg-slate-50/80 sticky top-0 z-10">
          <ToolButton icon={Undo2} title="Undo" onClick={() => exec("undo")} />
          <ToolButton icon={Redo2} title="Redo" onClick={() => exec("redo")} />

          <Divider />

          <select
            value={BLOCK_OPTIONS.some((o) => o.value === activeFormats.block)
              ? activeFormats.block
              : "p"}
            onChange={(e) => applyBlock(e.target.value)}
            disabled={disabled || showSource}
            title="Text style"
            className="text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-purple-400 disabled:opacity-40"
          >
            {BLOCK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <Divider />

          <ToolButton icon={Bold} title="Bold (Ctrl+B)" active={activeFormats.bold} onClick={() => exec("bold")} />
          <ToolButton icon={Italic} title="Italic (Ctrl+I)" active={activeFormats.italic} onClick={() => exec("italic")} />
          <ToolButton icon={Underline} title="Underline (Ctrl+U)" active={activeFormats.underline} onClick={() => exec("underline")} />
          <ToolButton icon={Strikethrough} title="Strikethrough" active={activeFormats.strikeThrough} onClick={() => exec("strikeThrough")} />

          <Divider />

          <ToolButton icon={List} title="Bulleted list" active={activeFormats.insertUnorderedList} onClick={() => exec("insertUnorderedList")} />
          <ToolButton icon={ListOrdered} title="Numbered list" active={activeFormats.insertOrderedList} onClick={() => exec("insertOrderedList")} />
          <ToolButton icon={Quote} title="Quote" active={activeFormats.block === "blockquote"} onClick={() => applyBlock("blockquote")} />
          <ToolButton icon={Code} title="Code block" active={activeFormats.block === "pre"} onClick={() => applyBlock("pre")} />

          <Divider />

          <ToolButton icon={AlignLeft} title="Align left" onClick={() => exec("justifyLeft")} />
          <ToolButton icon={AlignCenter} title="Align center" onClick={() => exec("justifyCenter")} />
          <ToolButton icon={AlignRight} title="Align right" onClick={() => exec("justifyRight")} />

          <Divider />

          <ToolButton icon={Link2} title="Insert link" onClick={openLinkModal} />
          <ToolButton icon={Link2Off} title="Remove link" onClick={() => exec("unlink")} />
          <ToolButton
            icon={uploading ? Loader2 : ImagePlus}
            title="Upload image"
            disabled={uploading}
            onClick={() => {
              saveSelection();
              fileRef.current?.click();
            }}
          />
          <ToolButton
            icon={ImageIcon}
            title="Insert image by URL"
            onClick={() => {
              saveSelection();
              setImageUrlModal({ url: "", alt: "" });
            }}
          />
          <ToolButton icon={Minus} title="Divider" onClick={() => exec("insertHorizontalRule")} />
          <ToolButton icon={Eraser} title="Clear formatting" onClick={() => exec("removeFormat")} />

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSource}
              disabled={disabled}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                showSource
                  ? "bg-purple-100 text-purple-700"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {showSource ? "Visual" : "HTML"}
            </button>
          </div>
        </div>

        {/* ─── Editing surface ─────────────────────────────── */}
        {showSource ? (
          <textarea
            value={sourceDraft}
            onChange={(e) => setSourceDraft(e.target.value)}
            spellCheck={false}
            style={{ minHeight }}
            className="w-full p-4 font-mono text-xs text-slate-700 outline-none resize-y"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable={!disabled}
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label={label || "Content"}
            data-placeholder={placeholder}
            onInput={emit}
            onBlur={() => {
              saveSelection();
              emit();
            }}
            onKeyUp={refreshActiveFormats}
            onMouseUp={refreshActiveFormats}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            style={{ minHeight }}
            className="bt-rte prose-editor w-full p-5 outline-none text-slate-700 text-[15px] leading-7 overflow-y-auto"
          />
        )}

        {/* ─── Status bar ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500">
          <span>
            {stats.words} word{stats.words === 1 ? "" : "s"} · ~{stats.minutes} min read
          </span>
          <span className="hidden sm:inline">
            Paste is stripped to plain text · Tab indents
          </span>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => uploadImage(e.target.files?.[0])}
      />

      {/* ─── Link modal ─────────────────────────────────────── */}
      {linkModal && (
        <Modal title="Insert link" onClose={() => setLinkModal(null)}>
          <div className="space-y-3">
            <Field
              label="URL"
              value={linkModal.url}
              autoFocus
              placeholder="https://example.com"
              onChange={(v) => setLinkModal((m) => ({ ...m, url: v }))}
            />
            <Field
              label="Link text"
              value={linkModal.text}
              placeholder="Read the guide"
              onChange={(v) => setLinkModal((m) => ({ ...m, text: v }))}
            />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={linkModal.newTab}
                onChange={(e) =>
                  setLinkModal((m) => ({ ...m, newTab: e.target.checked }))
                }
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              Open in a new tab
            </label>
          </div>
          <ModalActions
            onCancel={() => setLinkModal(null)}
            onConfirm={applyLink}
            confirmLabel="Insert link"
            confirmDisabled={!linkModal.url.trim()}
          />
        </Modal>
      )}

      {/* ─── Image-by-URL modal ─────────────────────────────── */}
      {imageUrlModal && (
        <Modal title="Insert image by URL" onClose={() => setImageUrlModal(null)}>
          <div className="space-y-3">
            <Field
              label="Image URL"
              value={imageUrlModal.url}
              autoFocus
              placeholder="https://…/photo.jpg"
              onChange={(v) => setImageUrlModal((m) => ({ ...m, url: v }))}
            />
            <Field
              label="Alt text (helps SEO & screen readers)"
              value={imageUrlModal.alt}
              placeholder="Support worker helping a participant"
              onChange={(v) => setImageUrlModal((m) => ({ ...m, alt: v }))}
            />
          </div>
          <ModalActions
            onCancel={() => setImageUrlModal(null)}
            onConfirm={applyImageUrl}
            confirmLabel="Insert image"
            confirmDisabled={!imageUrlModal.url.trim()}
          />
        </Modal>
      )}
    </div>
  );
};

// ─── Small local modal primitives ──────────────────────────────────
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Field = ({ label, value, onChange, placeholder, autoFocus }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      autoFocus={autoFocus}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
    />
  </div>
);

const ModalActions = ({ onCancel, onConfirm, confirmLabel, confirmDisabled }) => (
  <div className="flex gap-2 justify-end mt-6">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
    >
      Cancel
    </button>
    <button
      type="button"
      onClick={onConfirm}
      disabled={confirmDisabled}
      className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {confirmLabel}
    </button>
  </div>
);

export default RichTextEditor;
