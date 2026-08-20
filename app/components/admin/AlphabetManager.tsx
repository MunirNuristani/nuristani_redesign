"use client";

import { useState, useEffect } from "react";
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

interface AlphabetLetter {
  id: string;
  letter: string;
  latin: string;
  name: string;
  description: string;
  recordingOggUrl: string;
  recordingMp3Url: string;
  order: number;
}

export default function AlphabetManager() {
  const [letters, setLetters] = useState<AlphabetLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState<AlphabetLetter | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [letter, setLetter] = useState("");
  const [latin, setLatin] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");
  const [oggFile, setOggFile] = useState<File | null>(null);
  const [mp3File, setMp3File] = useState<File | null>(null);

  const fetchLetters = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "alphabet"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const data: AlphabetLetter[] = [];
      querySnapshot.forEach((d) => data.push({ id: d.id, ...d.data() } as AlphabetLetter));
      setLetters(data);
    } catch (err) {
      console.error("Error fetching alphabet:", err);
      setError("Failed to load alphabet letters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const resetForm = () => {
    setLetter("");
    setLatin("");
    setName("");
    setDescription("");
    setOrder("");
    setOggFile(null);
    setMp3File(null);
    setEditingLetter(null);
    setDialogOpen(false);
    setError(null);
  };

  const handleAddNew = () => {
    resetForm();
    setOrder(String(letters.length + 1));
    setDialogOpen(true);
  };

  const handleEdit = (item: AlphabetLetter) => {
    setEditingLetter(item);
    setLetter(item.letter);
    setLatin(item.latin);
    setName(item.name);
    setDescription(item.description);
    setOrder(String(item.order));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      setError(null);

      if (!letter || !latin || !name) {
        setError("Please fill in the letter, latin, and name fields");
        setUploading(false);
        return;
      }
      const orderNum = Number(order);
      if (!order || Number.isNaN(orderNum)) {
        setError("Please enter a valid order number");
        setUploading(false);
        return;
      }

      let recordingOggUrl = editingLetter?.recordingOggUrl || "";
      let recordingMp3Url = editingLetter?.recordingMp3Url || "";

      if (oggFile) {
        const fileName = `${Date.now()}-ogg-${oggFile.name}`;
        const storageRef = ref(storage, `audioRecordings/${fileName}`);
        await uploadBytes(storageRef, oggFile);
        recordingOggUrl = await getDownloadURL(storageRef);
      }
      if (mp3File) {
        const fileName = `${Date.now()}-mp3-${mp3File.name}`;
        const storageRef = ref(storage, `audioRecordings/${fileName}`);
        await uploadBytes(storageRef, mp3File);
        recordingMp3Url = await getDownloadURL(storageRef);
      }

      const letterData = {
        letter,
        latin,
        name,
        description,
        recordingOggUrl,
        recordingMp3Url,
        order: orderNum,
      };

      if (editingLetter) {
        await updateDoc(doc(db, "alphabet", editingLetter.id), letterData);
        setSuccess("Letter updated successfully!");
      } else {
        await addDoc(collection(db, "alphabet"), letterData);
        setSuccess("Letter added successfully!");
      }

      await fetchLetters();
      resetForm();
    } catch (err) {
      console.error("Error saving letter:", err);
      setError("Failed to save letter");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: AlphabetLetter) => {
    if (!confirm(`Are you sure you want to delete "${item.letter}"?`)) return;

    try {
      setLoading(true);
      // Best-effort: works for files uploaded via this admin UI. Recordings migrated from
      // Airtable use a plain GCS public URL that Firebase's ref() can't parse — those are
      // simply left in Storage (harmless, just unreferenced).
      for (const url of [item.recordingOggUrl, item.recordingMp3Url]) {
        if (!url) continue;
        try {
          await deleteObject(ref(storage, url));
        } catch (err) {
          console.error("Error deleting recording from storage:", err);
        }
      }
      await deleteDoc(doc(db, "alphabet", item.id));
      setSuccess("Letter deleted successfully!");
      await fetchLetters();
    } catch (err) {
      console.error("Error deleting letter:", err);
      setError("Failed to delete letter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Alphabet Management</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Letter
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Letter</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Latin</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Audio</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {letters.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.order}</td>
                  <td className="px-4 py-3 text-lg font-semibold">{item.letter}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-mono" dir="ltr">{item.latin}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.name}</td>
                  <td className="px-4 py-3 text-sm">
                    {item.recordingOggUrl && <span className="text-green-600 text-xs mr-2">ogg ✓</span>}
                    {item.recordingMp3Url && <span className="text-green-600 text-xs">mp3 ✓</span>}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit letter"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete letter"
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingLetter ? "Edit Letter" : "Add New Letter"}
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
                    <label htmlFor="letter" className="block text-sm font-medium text-gray-700 mb-2">Letter</label>
                    <input
                      id="letter"
                      type="text"
                      value={letter}
                      onChange={(e) => setLetter(e.target.value)}
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
                  <label htmlFor="latin" className="block text-sm font-medium text-gray-700 mb-2">Latin transliteration</label>
                  <input
                    id="latin"
                    type="text"
                    value={latin}
                    onChange={(e) => setLatin(e.target.value)}
                    disabled={uploading}
                    dir="ltr"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name of the letter</label>
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
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Usage / description</label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={uploading}
                    dir="rtl"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      accept="audio/ogg"
                      type="file"
                      onChange={(e) => setOggFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="ogg-upload"
                    />
                    <label
                      htmlFor="ogg-upload"
                      className="w-full inline-flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors cursor-pointer text-sm text-center"
                    >
                      {oggFile ? oggFile.name : editingLetter?.recordingOggUrl ? "Replace .ogg recording" : "Upload .ogg recording"}
                    </label>
                  </div>
                  <div>
                    <input
                      accept="audio/mpeg"
                      type="file"
                      onChange={(e) => setMp3File(e.target.files?.[0] || null)}
                      className="hidden"
                      id="mp3-upload"
                    />
                    <label
                      htmlFor="mp3-upload"
                      className="w-full inline-flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors cursor-pointer text-sm text-center"
                    >
                      {mp3File ? mp3File.name : editingLetter?.recordingMp3Url ? "Replace .mp3 recording" : "Upload .mp3 recording"}
                    </label>
                  </div>
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
