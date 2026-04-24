import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";

const CreateBlog = ({ userData, setActiveTab }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState(userData?.name || "");
  const [publishDate, setPublishDate] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false); // loading state

  const quillRef = useRef(null);

  // Load JWT token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      alert("You must be logged in to publish a blog.");
      return;
    }
    setToken(storedToken);
  }, []);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Insert table in editor
  const insertTable = () => {
    const rows = parseInt(prompt("Number of rows", "2"));
    const cols = parseInt(prompt("Number of columns", "2"));
    if (!rows || !cols) return;

    let table = "<table class='border border-gray-300 w-full'>";
    for (let r = 0; r < rows; r++) {
      table += "<tr>";
      for (let c = 0; c < cols; c++) {
        table += "<td class='border p-2'>&nbsp;</td>";
      }
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
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "blockquote", "code-block"],
        ["clean"],
        ["insertTable"],
      ],
      handlers: { insertTable },
    },
  };

  // Submit blog
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

    setLoading(true); // start loading

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("content", content);
      formData.append("author", author);
      formData.append("publishDate", publishDate);
      if (image) formData.append("featuredImage", image);

      await axios.post(
        "http://localhost:5000/api/blogs/publish",
        formData,
        axiosConfig
      );

      alert("🎉 Blog published successfully!");

      // Switch dashboard tab
      if (setActiveTab) setActiveTab("published-blogs");

      // Reset form
      setTitle("");
      setCategory("");
      setContent("");
      setAuthor(userData?.name || "");
      setPublishDate("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err.response?.data || err);
      if (err.response?.status === 401) {
        alert("Unauthorized! Please login again.");
        localStorage.removeItem("token");
      } else {
        alert(err.response?.data?.message || "Error publishing blog. Try again!");
      }
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">Create Blog</h2>

        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />

        <input
          type="text"
          placeholder="Author Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        >
          <option value="">Select Category</option>
          <option value="Technology">Technology</option>
          <option value="AI">AI</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Travel">Travel</option>
        </select>

        <input
          type="date"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />

        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            theme="snow"
            modules={modules}
            placeholder="Write your content here..."
            className="h-64"
          />
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:text-gray-700 file:bg-gray-50 file:hover:bg-gray-100 cursor-pointer"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-64 h-40 object-cover rounded-lg mt-2 shadow"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading} // disable during loading
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
