"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { storage, db } from "@/utils/firebase-config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { ArticleBlock, isArticleBlocks } from "@/utils/articleBlocks";

interface Article {
  id: string;
  name: string;
  nameEn: string;
  author: string;
  authorEn: string;
  language: string;
  body: string | ArticleBlock[];
  pictures: string[];
  order: number;
}

const LANGUAGE_OPTIONS = [
  { value: "prs", label: "Dari" },
  { value: "ps", label: "Pashto" },
  { value: "nr", label: "Nuristani" },
  { value: "en", label: "English" },
];

const BLOCK_TYPE_OPTIONS: { type: ArticleBlock["type"]; label: string }[] = [
  { type: "paragraph", label: "Paragraph" },
  { type: "heading", label: "Heading" },
  { type: "quote", label: "Quote" },
  { type: "list", label: "List" },
  { type: "image", label: "Image" },
];

function emptyBlock(type: ArticleBlock["type"]): ArticleBlock {
  if (type === "image") return { type, url: "" };
  if (type === "list") return { type, ordered: false, items: [] };
  return { type, content: "" };
}

export default function ArticlesManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [author, setAuthor] = useState("");
  const [authorEn, setAuthorEn] = useState("");
  const [language, setLanguage] = useState("prs");
  const [order, setOrder] = useState("");

  // Legacy (string body) editing state — used only while a pre-existing string-body
  // article hasn't been converted to the block editor yet.
  const [legacyBody, setLegacyBody] = useState("");
  const [legacyPictures, setLegacyPictures] = useState<string[]>([]);
  const [newPictureFiles, setNewPictureFiles] = useState<File[]>([]);

  // Block editor state — used for new articles and for legacy articles once converted.
  const [useBlockEditor, setUseBlockEditor] = useState(true);
  const [blocks, setBlocks] = useState<ArticleBlock[]>([]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "articles"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const data: Article[] = [];
      querySnapshot.forEach((d) => data.push({ id: d.id, ...d.data() } as Article));
      setArticles(data);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const resetForm = () => {
    setName("");
    setNameEn("");
    setAuthor("");
    setAuthorEn("");
    setLanguage("prs");
    setOrder("");
    setLegacyBody("");
    setLegacyPictures([]);
    setNewPictureFiles([]);
    setUseBlockEditor(true);
    setBlocks([]);
    setEditingArticle(null);
    setDialogOpen(false);
    setError(null);
  };

  const handleAddNew = () => {
    resetForm();
    setOrder(String(articles.length + 1));
    setDialogOpen(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setName(article.name);
    setNameEn(article.nameEn);
    setAuthor(article.author);
    setAuthorEn(article.authorEn);
    setLanguage(article.language);
    setOrder(String(article.order));

    if (isArticleBlocks(article.body)) {
      setUseBlockEditor(true);
      setBlocks(article.body);
    } else {
      setUseBlockEditor(false);
      setLegacyBody(article.body || "");
      setLegacyPictures(article.pictures || []);
    }
    setDialogOpen(true);
  };

  const handleConvertToBlocks = () => {
    const seeded: ArticleBlock[] = [
      { type: "paragraph", content: legacyBody },
      ...legacyPictures.map((url): ArticleBlock => ({ type: "image", url })),
    ];
    setBlocks(seeded);
    setUseBlockEditor(true);
  };

  const handleRemoveLegacyPicture = (url: string) => {
    setLegacyPictures((prev) => prev.filter((p) => p !== url));
  };

  const addBlock = (type: ArticleBlock["type"]) => {
    setBlocks((prev) => [...prev, emptyBlock(type)]);
  };

  const updateBlock = (index: number, patch: Partial<ArticleBlock>) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? ({ ...b, ...patch } as ArticleBlock) : b)));
  };

  const removeBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    setBlocks((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleBlockImageUpload = async (index: number, file: File) => {
    try {
      setUploading(true);
      const fileName = `${Date.now()}_${file.name}`;
      const path = `articlePictures/${editingArticle?.id || "new"}/${fileName}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      updateBlock(index, { url });
    } catch (err) {
      console.error("Error uploading block image:", err);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      setError(null);

      if (!name || !author) {
        setError("Please fill in the name and author fields");
        setUploading(false);
        return;
      }
      const orderNum = Number(order);
      if (!order || Number.isNaN(orderNum)) {
        setError("Please enter a valid order number");
        setUploading(false);
        return;
      }

      let articleData: Omit<Article, "id">;

      if (useBlockEditor) {
        if (blocks.length === 0) {
          setError("Add at least one field to the article body");
          setUploading(false);
          return;
        }
        articleData = { name, nameEn, author, authorEn, language, body: blocks, pictures: [], order: orderNum };
      } else {
        const finalPictures = [...legacyPictures];
        for (let i = 0; i < newPictureFiles.length; i++) {
          const file = newPictureFiles[i];
          const fileName = `${Date.now()}_${i}_${file.name}`;
          const path = `articlePictures/${editingArticle?.id || "new"}/${fileName}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, file);
          finalPictures.push(await getDownloadURL(storageRef));
        }
        articleData = { name, nameEn, author, authorEn, language, body: legacyBody, pictures: finalPictures, order: orderNum };
      }

      if (editingArticle) {
        await updateDoc(doc(db, "articles", editingArticle.id), articleData);
        setSuccess("Article updated successfully!");
      } else {
        await addDoc(collection(db, "articles"), articleData);
        setSuccess("Article added successfully!");
      }

      await fetchArticles();
      resetForm();
    } catch (err) {
      console.error("Error saving article:", err);
      setError("Failed to save article");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (article: Article) => {
    if (!confirm(`Are you sure you want to delete "${article.name}"?`)) return;

    try {
      setLoading(true);
      const imageUrls = isArticleBlocks(article.body)
        ? article.body.filter((b): b is Extract<ArticleBlock, { type: "image" }> => b.type === "image").map((b) => b.url)
        : article.pictures || [];
      // Best-effort: works for files uploaded via this admin UI. Pictures migrated from
      // Airtable use a plain GCS public URL that Firebase's ref() can't parse — those are
      // simply left in Storage (harmless, just unreferenced).
      for (const url of imageUrls) {
        try {
          await deleteObject(ref(storage, url));
        } catch (err) {
          console.error("Error deleting picture from storage:", err);
        }
      }
      await deleteDoc(doc(db, "articles", article.id));
      setSuccess("Article deleted successfully!");
      await fetchArticles();
    } catch (err) {
      console.error("Error deleting article:", err);
      setError("Failed to delete article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Articles Management</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Article
        </button>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {!loading && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Body</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-4 py-3 text-sm text-gray-500">{article.order}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={article.name}>{article.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{article.author}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 uppercase">{article.language}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {isArticleBlocks(article.body) ? (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {article.body.length} block{article.body.length === 1 ? "" : "s"}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        legacy · {article.pictures?.length || 0} picture{article.pictures?.length === 1 ? "" : "s"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit article"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(article)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete article"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingArticle ? "Edit Article" : "Add New Article"}
              </h3>
            </div>
            <div className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex justify-between items-center">
                  <span>{error}</span>
                  <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={uploading}
                      dir="rtl"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="name-en" className="block text-sm font-medium text-gray-700 mb-2">Name (English, optional)</label>
                    <input
                      id="name-en"
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      disabled={uploading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                    <input
                      id="author"
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      disabled={uploading}
                      dir="rtl"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="author-en" className="block text-sm font-medium text-gray-700 mb-2">Author (English, optional)</label>
                    <input
                      id="author-en"
                      type="text"
                      value={authorEn}
                      onChange={(e) => setAuthorEn(e.target.value)}
                      disabled={uploading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      disabled={uploading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      {LANGUAGE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                    <input
                      id="order"
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      disabled={uploading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {!useBlockEditor ? (
                  <div className="space-y-4 border border-amber-200 bg-amber-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-amber-800">
                        This article still uses the old single-HTML-body format.
                      </p>
                      <button
                        type="button"
                        onClick={handleConvertToBlocks}
                        className="px-3 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
                      >
                        Convert to block editor
                      </button>
                    </div>

                    <div>
                      <label htmlFor="legacy-body" className="block text-sm font-medium text-gray-700 mb-2">Body (HTML)</label>
                      <textarea
                        id="legacy-body"
                        rows={10}
                        value={legacyBody}
                        onChange={(e) => setLegacyBody(e.target.value)}
                        disabled={uploading}
                        dir="rtl"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pictures</label>
                      {legacyPictures.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 mb-3">
                          {legacyPictures.map((url) => (
                            <div key={url} className="relative h-24 rounded overflow-hidden border border-gray-200 group">
                              <Image src={url} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                              <button
                                type="button"
                                onClick={() => handleRemoveLegacyPicture(url)}
                                disabled={uploading}
                                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove picture"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <input
                        accept="image/*"
                        type="file"
                        multiple
                        onChange={(e) => setNewPictureFiles(Array.from(e.target.files || []))}
                        className="hidden"
                        id="pictures-upload"
                      />
                      <label
                        htmlFor="pictures-upload"
                        className="w-full inline-flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        {newPictureFiles.length > 0 ? `${newPictureFiles.length} new picture(s) selected` : "Add pictures"}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">The first picture is used as the article&apos;s cover image.</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
                    <div className="space-y-3">
                      {blocks.map((block, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full uppercase">
                              {block.type}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveBlock(index, -1)}
                                disabled={uploading || index === 0}
                                className="p-1.5 text-gray-500 hover:bg-gray-200 rounded disabled:opacity-30"
                                title="Move up"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moveBlock(index, 1)}
                                disabled={uploading || index === blocks.length - 1}
                                className="p-1.5 text-gray-500 hover:bg-gray-200 rounded disabled:opacity-30"
                                title="Move down"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => removeBlock(index)}
                                disabled={uploading}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                title="Remove field"
                              >
                                ×
                              </button>
                            </div>
                          </div>

                          {block.type === "image" ? (
                            <div className="space-y-2">
                              {block.url && (
                                <div className="relative h-40 rounded overflow-hidden border border-gray-200">
                                  <Image src={block.url} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                                </div>
                              )}
                              <input
                                accept="image/*"
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleBlockImageUpload(index, file);
                                }}
                                className="hidden"
                                id={`block-image-${index}`}
                              />
                              <label
                                htmlFor={`block-image-${index}`}
                                className="w-full inline-flex items-center justify-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors cursor-pointer text-sm"
                              >
                                {block.url ? "Replace image" : "Upload image"}
                              </label>
                              <input
                                type="text"
                                value={block.caption || ""}
                                onChange={(e) => updateBlock(index, { caption: e.target.value })}
                                disabled={uploading}
                                placeholder="Caption (optional)"
                                dir="rtl"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                              />
                            </div>
                          ) : block.type === "list" ? (
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={block.ordered}
                                  onChange={(e) => updateBlock(index, { ordered: e.target.checked })}
                                  disabled={uploading}
                                />
                                Numbered list
                              </label>
                              <textarea
                                rows={4}
                                value={block.items.join("\n")}
                                onChange={(e) => updateBlock(index, { items: e.target.value.split("\n") })}
                                disabled={uploading}
                                dir="rtl"
                                placeholder="One item per line"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                              />
                            </div>
                          ) : (
                            <textarea
                              rows={block.type === "heading" ? 1 : 4}
                              value={block.content}
                              onChange={(e) => updateBlock(index, { content: e.target.value })}
                              disabled={uploading}
                              dir="rtl"
                              placeholder={block.type === "heading" ? "Heading text" : block.type === "quote" ? "Quote text" : "Paragraph text (basic HTML like <b>/<a> is fine)"}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {BLOCK_TYPE_OPTIONS.map((opt) => (
                        <button
                          key={opt.type}
                          type="button"
                          onClick={() => addBlock(opt.type)}
                          disabled={uploading}
                          className="px-3 py-2 text-sm border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
                        >
                          + {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={resetForm}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={uploading}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400"
              >
                {uploading && (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {uploading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
