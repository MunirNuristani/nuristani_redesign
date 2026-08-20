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

interface Book {
  id: string;
  title: string;
  author: string;
  translator: string;
  coverUrl: string;
  linkUrl: string;
  order: number;
}

export default function BooksManager() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [translator, setTranslator] = useState("");
  const [order, setOrder] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [linkFile, setLinkFile] = useState<File | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "books"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const data: Book[] = [];
      querySnapshot.forEach((d) => data.push({ id: d.id, ...d.data() } as Book));
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setTranslator("");
    setOrder("");
    setCoverFile(null);
    setCoverPreview(null);
    setLinkFile(null);
    setEditingBook(null);
    setDialogOpen(false);
    setError(null);
  };

  const handleAddNew = () => {
    resetForm();
    setOrder(String(books.length + 1));
    setDialogOpen(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setTranslator(book.translator);
    setOrder(String(book.order));
    setCoverPreview(book.coverUrl || null);
    setDialogOpen(true);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      setError(null);

      if (!title || !author) {
        setError("Please fill in the title and author fields");
        setUploading(false);
        return;
      }
      const orderNum = Number(order);
      if (!order || Number.isNaN(orderNum)) {
        setError("Please enter a valid order number");
        setUploading(false);
        return;
      }

      let coverUrl = editingBook?.coverUrl || "";
      let linkUrl = editingBook?.linkUrl || "";

      if (coverFile) {
        const fileName = `${Date.now()}_${coverFile.name}`;
        const storageRef = ref(storage, `bookcovers/${fileName}`);
        await uploadBytes(storageRef, coverFile);
        coverUrl = await getDownloadURL(storageRef);
      }
      if (linkFile) {
        const fileName = `${Date.now()}_${linkFile.name}`;
        const storageRef = ref(storage, `bookLinks/${fileName}`);
        await uploadBytes(storageRef, linkFile);
        linkUrl = await getDownloadURL(storageRef);
      }

      const bookData = {
        title,
        author,
        translator,
        coverUrl,
        linkUrl,
        order: orderNum,
      };

      if (editingBook) {
        await updateDoc(doc(db, "books", editingBook.id), bookData);
        setSuccess("Book updated successfully!");
      } else {
        await addDoc(collection(db, "books"), bookData);
        setSuccess("Book added successfully!");
      }

      await fetchBooks();
      resetForm();
    } catch (err) {
      console.error("Error saving book:", err);
      setError("Failed to save book");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (book: Book) => {
    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return;

    try {
      setLoading(true);
      // Best-effort: works for files uploaded via this admin UI. Files migrated from
      // Airtable use a plain GCS public URL that Firebase's ref() can't parse — those are
      // simply left in Storage (harmless, just unreferenced).
      for (const url of [book.coverUrl, book.linkUrl]) {
        if (!url) continue;
        try {
          await deleteObject(ref(storage, url));
        } catch (err) {
          console.error("Error deleting file from storage:", err);
        }
      }
      await deleteDoc(doc(db, "books", book.id));
      setSuccess("Book deleted successfully!");
      await fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
      setError("Failed to delete book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Books Management</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Book
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="relative h-64 bg-gray-100">
                {book.coverUrl && (
                  <Image src={book.coverUrl} alt={book.title} fill style={{ objectFit: "cover" }} unoptimized />
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold mb-1 line-clamp-2">{book.title}</p>
                <p className="text-xs text-gray-600">{book.author}</p>
                {book.linkUrl && (
                  <a href={book.linkUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    View file
                  </a>
                )}
              </div>
              <div className="p-2 flex justify-start gap-2 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(book)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit book"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(book)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete book"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingBook ? "Edit Book" : "Add New Book"}
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
                <div>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={handleCoverChange}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {coverFile ? `Change Cover (${coverFile.name})` : editingBook ? "Change Cover" : "Upload Cover Image"}
                  </label>
                  {coverPreview && (
                    <div className="mt-4 w-full bg-gray-100 p-4 rounded">
                      <div className="relative w-full h-64">
                        <Image src={coverPreview} alt="Preview" fill style={{ objectFit: "contain" }} unoptimized />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={uploading}
                      dir="rtl"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
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
                  <label htmlFor="translator" className="block text-sm font-medium text-gray-700 mb-2">Translator (optional)</label>
                  <input
                    id="translator"
                    type="text"
                    value={translator}
                    onChange={(e) => setTranslator(e.target.value)}
                    disabled={uploading}
                    dir="rtl"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <input
                    type="file"
                    onChange={(e) => setLinkFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="link-upload"
                  />
                  <label
                    htmlFor="link-upload"
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {linkFile ? linkFile.name : editingBook?.linkUrl ? "Replace linked file" : "Upload linked file (PDF, etc.)"}
                  </label>
                </div>
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
