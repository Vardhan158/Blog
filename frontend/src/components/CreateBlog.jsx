import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { clearLegacyLocalAuth, clearUserSession, getToken } from "../utils/authStorage";

const API_URL = import.meta.env.VITE_API_URL || "https://blog-backend-omyx.onrender.com";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes successPop {
    0%   { transform: scale(0.8); opacity: 0; }
    70%  { transform: scale(1.08); }
    100% { transform: scale(1); opacity: 1; }
  }

  .cb-root {
    --ink:    #1e1b4b;
    --ink2:   #475569;
    --ink3:   #94a3b8;
    --ink4:   #cbd5e1;
    --paper:  #ffffff;
    --paper2: #f8faff;
    --paper3: #f1f5f9;
    --rule:   #e2e8f0;
    --accent: #6366f1;
    --accent2:#818cf8;
    height: 100%;
    background: var(--paper);
    display: flex;
    flex-direction: column;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
  }

  /* ── Form card ── */
  .cb-form {
    width: 100%;
    height: 100%;
    background: var(--paper);
    display: flex;
    flex-direction: column;
    padding: 20px 24px;
    box-sizing: border-box;
  }

  .cb-form-body {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 32px;
    align-items: start;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .cb-form-sidebar {
    height: 100%;
    overflow-y: auto;
    padding-right: 8px;
  }

  /* Custom scrollbar for sidebar */
  .cb-form-sidebar::-webkit-scrollbar { width: 4px; }
  .cb-form-sidebar::-webkit-scrollbar-thumb { background: var(--paper3); border-radius: 4px; }

  @media (max-width: 1024px) {
    .cb-form-body {
      grid-template-columns: 1fr;
      overflow-y: auto;
    }
    .cb-form-sidebar { height: auto; overflow: visible; }
  }

  /* ── Header ── */
  .cb-header {
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--rule);
    flex-shrink: 0;
  }
  .cb-eyebrow {
    font-size: clamp(10px, 1.6vw, 11px);
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0 0 8px;
  }
  .cb-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 700;
    color: var(--ink);
    margin: 0;
    line-height: 1.15;
  }
  .cb-subtitle {
    margin: 8px 0 0;
    color: var(--ink3);
    font-size: clamp(13px, 2vw, 15px);
    font-weight: 400;
  }

  /* ── Field groups ── */
  .cb-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(14px, 2.5vw, 20px);
  }
  @media (max-width: 560px) {
    .cb-grid-2 { grid-template-columns: 1fr; }
  }

  .cb-form-main {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .cb-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
  }
  .cb-label {
    font-size: clamp(10px, 1.6vw, 11px);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink3);
  }
  .cb-label span {
    color: var(--accent);
    margin-left: 2px;
  }

  .cb-input, .cb-select {
    width: 100%;
    padding: clamp(10px, 2vw, 13px) clamp(12px, 2.5vw, 16px);
    border: 1px solid var(--rule);
    background: var(--paper);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(13px, 2.2vw, 15px);
    outline: none;
    border-radius: 2px;
    transition: border-color 0.18s, background 0.18s;
    -webkit-appearance: none;
    appearance: none;
  }
  .cb-input::placeholder { color: var(--ink4); }
  .cb-input:focus, .cb-select:focus {
    border-color: var(--accent);
    background: #fff;
  }

  /* Select wrapper with custom arrow */
  .cb-select-wrap {
    position: relative;
  }
  .cb-select-wrap::after {
    content: '';
    pointer-events: none;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 0; height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid var(--ink3);
  }
  .cb-select { cursor: pointer; padding-right: 36px; }
  .cb-select option { color: var(--ink); }

  /* ── Editor section ── */
  .cb-editor-label {
    font-size: clamp(10px, 1.6vw, 11px);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink3);
    margin-bottom: 8px;
  }
  .cb-editor-wrap {
    border: 1px solid var(--rule);
    border-radius: 4px;
    background: var(--paper);
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    margin-bottom: 16px;
  }
  .cb-editor-wrap:focus-within {
    border-color: var(--accent);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
  }

  /* Override Quill toolbar */
  .cb-editor-wrap .ql-toolbar {
    border: none !important;
    border-bottom: 1px solid var(--rule) !important;
    background: #fff !important;
    padding: 12px 14px !important;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .cb-editor-wrap .ql-container {
    border: none !important;
    font-family: 'Source Serif 4', serif !important;
    font-size: 18px !important;
    flex: 1;
    min-height: 0;
  }
  .cb-editor-wrap .ql-editor {
    flex: 1;
    padding: 24px 28px;
    color: var(--ink);
    line-height: 1.8;
  }
  .cb-editor-wrap .ql-editor.ql-blank::before {
    color: var(--ink4) !important;
    font-style: normal !important;
    font-size: 16px;
    left: 28px;
    pointer-events: none;
  }

  /* Typography for the editor content */
  .cb-editor-wrap .ql-editor h1 { font-family: 'Playfair Display', serif; font-size: 2em; color: var(--ink); margin-bottom: 0.5em; }
  .cb-editor-wrap .ql-editor h2 { font-family: 'Playfair Display', serif; font-size: 1.6em; color: var(--ink); margin: 1.2em 0 0.5em; }
  .cb-editor-wrap .ql-editor h3 { font-family: 'Playfair Display', serif; font-size: 1.3em; color: var(--ink); font-style: italic; margin: 1em 0 0.4em; }
  .cb-editor-wrap .ql-editor p { margin-bottom: 1.1em; }
  .cb-editor-wrap .ql-editor blockquote {
    border-left: 3px solid var(--accent);
    padding-left: 1.5em;
    font-style: italic;
    color: var(--ink2);
    font-family: 'Source Serif 4', serif;
    margin: 1.5em 0;
  }
  .cb-editor-wrap .ql-editor pre {
    background: #18160f;
    color: #e8e0d0;
    padding: 1em;
    border-radius: 4px;
    font-size: 14px;
  }

  .cb-editor-wrap .ql-stroke { stroke: var(--ink2) !important; }
  .cb-editor-wrap .ql-fill  { fill:   var(--ink2) !important; }
  .cb-editor-wrap .ql-picker-label { color: var(--ink2) !important; }

  /* ── Image upload ── */
  .cb-upload-area {
    border: 1.5px dashed var(--paper3);
    border-radius: 2px;
    padding: clamp(20px, 4vw, 32px);
    text-align: center;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s;
    margin-bottom: clamp(16px, 3vw, 22px);
    position: relative;
  }
  .cb-upload-area:hover {
    border-color: var(--accent);
    background: #fff9f8;
  }
  .cb-upload-input {
    position: absolute; inset: 0;
    opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .cb-upload-icon {
    font-size: 28px; margin-bottom: 8px; color: var(--ink4);
  }
  .cb-upload-text {
    font-size: clamp(13px, 2vw, 14px);
    color: var(--ink3);
    margin: 0;
  }
  .cb-upload-text strong { color: var(--accent); font-weight: 600; }
  .cb-upload-hint {
    font-size: 11px; color: var(--ink4); margin: 4px 0 0;
  }

  /* Image preview */
  .cb-preview-wrap {
    position: relative;
    display: inline-block;
    margin-bottom: clamp(16px, 3vw, 22px);
  }
  .cb-preview-img {
    width: 100%;
    max-height: clamp(160px, 30vw, 240px);
    object-fit: cover;
    display: block;
    border: 1px solid var(--rule);
    border-radius: 2px;
  }
  .cb-preview-remove {
    position: absolute;
    top: 8px; right: 8px;
    background: rgba(26,23,20,0.75);
    color: #fff;
    border: none;
    border-radius: 2px;
    padding: 4px 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  .cb-preview-remove:hover { background: var(--accent); }

  /* ── Divider ── */
  .cb-divider {
    display: flex; align-items: center; gap: 12px;
    margin: clamp(20px, 4vw, 32px) 0;
  }
  .cb-divider-line { flex: 1; height: 1px; background: var(--rule); }
  .cb-divider-icon { color: var(--ink4); font-size: 14px; }

  /* ── Submit button ── */
  .cb-submit {
    width: 100%;
    padding: 12px 16px;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: #fff;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(14px, 2.2vw, 16px);
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .cb-submit:hover:not(:disabled) {
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
    transform: translateY(-2px);
  }
  .cb-submit:active:not(:disabled) { transform: translateY(0); }
  .cb-submit:disabled { background: var(--ink4); cursor: not-allowed; }

  .cb-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* ── Toast ── */
  .cb-toast {
    position: fixed;
    bottom: clamp(20px, 4vw, 32px);
    right: clamp(16px, 4vw, 32px);
    background: var(--ink);
    color: var(--paper);
    padding: 12px 20px;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    display: flex; align-items: center; gap: 10px;
    z-index: 9999;
    animation: successPop 0.3s ease both;
    box-shadow: 0 8px 28px rgba(26,23,20,0.18);
    max-width: min(360px, calc(100vw - 32px));
  }
  .cb-toast-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #5cb85c;
    flex-shrink: 0;
  }
`;

const CATEGORIES = ["Technology", "AI", "Health", "Education", "Lifestyle", "Travel"];

const CreateBlog = ({ userData, setActiveTab }) => {
  const [title, setTitle]           = useState("");
  const [category, setCategory]     = useState("");
  const [content, setContent]       = useState("");
  const [author, setAuthor]         = useState(userData?.name || "");
  const [publishDate, setPublishDate] = useState("");
  const [image, setImage]           = useState(null);
  const [preview, setPreview]       = useState(null);
  const [token, setToken]           = useState(null);
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState(false);

  const quillRef = useRef(null);

  useEffect(() => {
    const storedToken = getToken();
    if (!storedToken) {
      alert("You must be logged in to publish a blog.");
      return;
    }
    setToken(storedToken);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setPreview(null);
  };

  const insertTable = () => {
    const rows = parseInt(prompt("Number of rows", "2"));
    const cols = parseInt(prompt("Number of columns", "2"));
    if (!rows || !cols) return;
    let table = "<table class='border border-gray-300 w-full'>";
    for (let r = 0; r < rows; r++) {
      table += "<tr>";
      for (let c = 0; c < cols; c++) table += "<td class='border p-2'>&nbsp;</td>";
      table += "</tr>";
    }
    table += "</table><p><br/></p>";
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(true);
    editor.clipboard.dangerouslyPasteHTML(range.index, table);
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image", "video", "blockquote", "code-block"],
        ["clean"],
        ["insertTable"],
      ],
      handlers: { insertTable },
    },
  };

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !content || !author || !publishDate) {
      alert("Please fill all required fields!");
      return;
    }
    if (!token) {
      alert("You must be logged in to publish a blog.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("content", content);
      formData.append("author", author);
      formData.append("publishDate", publishDate);
      if (image) formData.append("featuredImage", image);

      await axios.post(
        `${API_URL}/api/blogs/publish`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      showToast();
      if (setActiveTab) setActiveTab("published-blogs");

      setTitle(""); setCategory(""); setContent("");
      setAuthor(userData?.name || ""); setPublishDate("");
      setImage(null); setPreview(null);
    } catch (err) {
      console.error(err.response?.data || err);
      if (err.response?.status === 401) {
        alert("Unauthorized! Please login again.");
        clearUserSession();
        clearLegacyLocalAuth();
      } else {
        alert(err.response?.data?.message || "Error publishing blog. Try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="cb-root">
        <form className="cb-form" onSubmit={handleSubmit}>

          {/* Header */}
          <div className="cb-header">
            <h1 className="cb-title">Write Your Story</h1>
          </div>

          <div className="cb-form-body">
            {/* Sidebar: Metadata & Image */}
            <div className="cb-form-sidebar">
              <div className="cb-field">
                <label className="cb-label">Category <span>*</span></label>
                <div className="cb-select-wrap">
                  <select
                    className="cb-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="cb-field">
                <label className="cb-label">Author <span>*</span></label>
                <input
                  type="text"
                  className="cb-input"
                  placeholder="Your name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>

              <div className="cb-field">
                <label className="cb-label">Publish Date <span>*</span></label>
                <input
                  type="date"
                  className="cb-input"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  required
                />
              </div>

              {/* Featured image */}
              <div style={{ marginTop: '24px' }}>
                <p className="cb-editor-label">Featured Image</p>
                {preview ? (
                  <div className="cb-preview-wrap" style={{ width: "100%" }}>
                    <img src={preview} alt="Preview" className="cb-preview-img" />
                    <button type="button" className="cb-preview-remove" onClick={removeImage}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cb-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      className="cb-upload-input"
                      onChange={handleImageChange}
                    />
                    <div className="cb-upload-icon">🖼</div>
                    <p className="cb-upload-text">
                      <strong>Click to upload</strong>
                    </p>
                    <p className="cb-upload-hint">1600 × 600 recommended</p>
                  </label>
                )}
              </div>
            </div>

            {/* Main: Title & Content */}
            <div className="cb-form-main">
              {/* Title */}
              <div className="cb-field">
                <label className="cb-label">Title <span>*</span></label>
                <input
                  type="text"
                  className="cb-input"
                  style={{ fontSize: '1.2rem', fontWeight: '500', padding: '14px 18px' }}
                  placeholder="Enter a compelling headline…"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Editor */}
              <div>
                <p className="cb-editor-label">Content <span style={{ color: "#c0392b" }}>*</span></p>
                <div className="cb-editor-wrap">
                  <ReactQuill
                    ref={quillRef}
                    value={content}
                    onChange={setContent}
                    theme="snow"
                    modules={modules}
                    placeholder="Write your content here…"
                    scrollingContainer="html"
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="cb-submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="cb-spinner" />
                    Publishing…
                  </>
                ) : (
                  "Publish Post"
                )}
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* Toast */}
      {toast && (
        <div className="cb-toast">
          <div className="cb-toast-dot" />
          Post published successfully!
        </div>
      )}
    </>
  );
};

export default CreateBlog;
