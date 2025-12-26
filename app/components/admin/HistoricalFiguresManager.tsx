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
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

interface HistoricalFigure {
  id: string;
  imageUrl: string;
  imagePath: string;
  caption: {
    en: string;
    prs: string;
    ps: string;
    nr: string;
  };
  era: string;
  createdAt: unknown;
  updatedAt: unknown;
}

const ERA_OPTIONS = [
  "Pre-1800",
  "1800-1850",
  "1850-1900",
  "1900-1920",
  "1920-1940",
  "1940-1960",
  "1960-1980",
  "1980-2000",
  "2000-Present",
  "Custom",
];

export default function HistoricalFiguresManager() {
  const [figures, setFigures] = useState<HistoricalFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFigure, setEditingFigure] = useState<HistoricalFigure | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [captionEn, setCaptionEn] = useState("");
  const [captionPrs, setCaptionPrs] = useState("");
  const [era, setEra] = useState("");
  const [customEra, setCustomEra] = useState("");

  // Fetch all figures
  const fetchFigures = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "historicalFigures"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const figuresData: HistoricalFigure[] = [];
      querySnapshot.forEach((doc) => {
        figuresData.push({ id: doc.id, ...doc.data() } as HistoricalFigure);
      });
      setFigures(figuresData);
    } catch (err) {
      console.error("Error fetching figures:", err);
      setError("Failed to load figures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFigures();
  }, []);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Reset form
  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setCaptionEn("");
    setCaptionPrs("");
    setEra("");
    setCustomEra("");
    setEditingFigure(null);
    setDialogOpen(false);
  };

  // Open dialog for adding new figure
  const handleAddNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  // Open dialog for editing
  const handleEdit = (figure: HistoricalFigure) => {
    setEditingFigure(figure);
    setCaptionEn(figure.caption.en);
    setCaptionPrs(figure.caption.prs);
    setEra(figure.era);
    setImagePreview(figure.imageUrl);
    setDialogOpen(true);
  };

  // Save (create or update)
  const handleSave = async () => {
    try {
      setUploading(true);
      setError(null);

      // Validation
      if (!captionEn || !captionPrs) {
        setError("Please fill in all captions");
        setUploading(false);
        return;
      }

      const finalEra = era === "Custom" ? customEra : era;
      if (!finalEra) {
        setError("Please select or enter an era");
        setUploading(false);
        return;
      }

      let imageUrl = editingFigure?.imageUrl || "";
      let imagePath = editingFigure?.imagePath || "";

      // Upload new image if selected
      if (imageFile) {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${imageFile.name}`;
        const storageRef = ref(storage, `historicalFigures/${fileName}`);

        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
        imagePath = `historicalFigures/${fileName}`;

        // Delete old image if editing
        if (editingFigure && editingFigure.imagePath) {
          try {
            const oldImageRef = ref(storage, editingFigure.imagePath);
            await deleteObject(oldImageRef);
          } catch (err) {
            console.error("Error deleting old image:", err);
          }
        }
      } else if (!editingFigure) {
        setError("Please select an image");
        setUploading(false);
        return;
      }

      const figureData = {
        imageUrl,
        imagePath,
        caption: {
          en: captionEn,
          prs: captionPrs,
          ps: captionPrs,
          nr: captionPrs,
        },
        era: finalEra,
        updatedAt: serverTimestamp(),
      };

      if (editingFigure) {
        // Update existing
        await updateDoc(doc(db, "historicalFigures", editingFigure.id), figureData);
        setSuccess("Figure updated successfully!");
      } else {
        // Create new
        await addDoc(collection(db, "historicalFigures"), {
          ...figureData,
          createdAt: serverTimestamp(),
        });
        setSuccess("Figure added successfully!");
      }

      await fetchFigures();
      resetForm();
    } catch (err) {
      console.error("Error saving figure:", err);
      setError("Failed to save figure");
    } finally {
      setUploading(false);
    }
  };

  // Delete figure
  const handleDelete = async (figure: HistoricalFigure) => {
    if (!confirm("Are you sure you want to delete this figure?")) return;

    try {
      setLoading(true);

      // Delete image from storage
      if (figure.imagePath) {
        try {
          const imageRef = ref(storage, figure.imagePath);
          await deleteObject(imageRef);
        } catch (err) {
          console.error("Error deleting image from storage:", err);
        }
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, "historicalFigures", figure.id));

      setSuccess("Figure deleted successfully!");
      await fetchFigures();
    } catch (err) {
      console.error("Error deleting figure:", err);
      setError("Failed to delete figure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Historical Figures Management
        </h2>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Figure
        </button>
      </div>

      {/* Success Alert (page level) */}
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

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Figures Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {figures.map((figure) => (
            <div key={figure.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="relative h-64">
                <Image
                  src={figure.imageUrl}
                  alt={figure.caption.en}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
              <div className="p-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-2">
                  {figure.era}
                </span>
                <p className="text-sm font-semibold mb-1">{figure.caption.en}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{figure.caption.prs}</p>
              </div>
              <div className="p-2 flex justify-start gap-2 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(figure)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit figure"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(figure)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete figure"
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

      {/* Add/Edit Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingFigure ? "Edit Historical Figure" : "Add New Historical Figure"}
              </h3>
            </div>
            <div className="p-6">
              {/* Error Alert (modal level) */}
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

          <div className="space-y-4 pt-4 gap-4">
              {/* Image Upload */}
              <div>
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`w-full inline-flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors cursor-pointer ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {imageFile ? `Change Image (${imageFile.name})` : editingFigure ? "Change Image" : "Upload Image"}
                </label>
                {imagePreview && (
                  <div className="mt-4 w-full bg-gray-100 p-4 rounded">
                    <p className="text-sm font-semibold mb-2 text-gray-700">Preview:</p>
                    <div className="relative w-full h-64">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        style={{ objectFit: "contain" }}
                        className="border-2 border-blue-500 rounded bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Captions */}
              <div className="my-2">
                <label htmlFor="caption-en" className="block text-sm font-medium text-gray-700 mb-2">
                  Caption (English)
                </label>
                <textarea
                  id="caption-en"
                  rows={2}
                  value={captionEn}
                  onChange={(e) => setCaptionEn(e.target.value)}
                  disabled={uploading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
              </div>
              <div className="my-2">
                <label htmlFor="caption-prs" className="block text-sm font-medium text-gray-700 mb-2">
                  Caption (دری / Dari)
                </label>
                <textarea
                  id="caption-prs"
                  rows={2}
                  value={captionPrs}
                  onChange={(e) => setCaptionPrs(e.target.value)}
                  disabled={uploading}
                  dir="rtl"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
              </div>      
              {/* Era Selection */}
              <div className="my-2">
                <label htmlFor="era" className="block text-sm font-medium text-gray-700 mb-2">
                  Era
                </label>
                <select
                  id="era"
                  value={era}
                  onChange={(e) => setEra(e.target.value)}
                  disabled={uploading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                >
                  <option value="">Select an era</option>
                  {ERA_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Era Input */}
              {era === "Custom" && (
                <div className="my-2">
                  <label htmlFor="custom-era" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Era
                  </label>
                  <input
                    id="custom-era"
                    type="text"
                    value={customEra}
                    onChange={(e) => setCustomEra(e.target.value)}
                    disabled={uploading}
                    placeholder="e.g., Medieval Period, Ancient Times"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                  />
                </div>
              )}
            </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={resetForm}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={uploading}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
