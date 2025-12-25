"use client";

import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
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
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          sx={{ textTransform: "none" }}
        >
          Add New Figure
        </Button>
      </div>

      {/* Success Alert (page level) */}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      )}

      {/* Figures Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {figures.map((figure) => (
            <Card key={figure.id}>
              <div className="relative h-64">
                <Image
                  src={figure.imageUrl}
                  alt={figure.caption.en}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
              <CardContent>
                <Chip label={figure.era} size="small" color="primary" sx={{ mb: 1 }} />
                <p className="text-sm font-semibold mb-1">{figure.caption.en}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{figure.caption.prs}</p>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEdit(figure)}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(figure)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => !uploading && resetForm()}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingFigure ? "Edit Historical Figure" : "Add New Historical Figure"}
        </DialogTitle>
        <DialogContent>
          {/* Error Alert (modal level) */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, mt: 2 }}>
              {error}
            </Alert>
          )}

          <div className="space-y-4 pt-4 gap-4">
            {/* Image Upload */}
            <div>
              <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  disabled={uploading}
                >
                  {imageFile ? `Change Image (${imageFile.name})` : editingFigure ? "Change Image" : "Upload Image"}
                </Button>
              </label>
              {imagePreview && (
                <div className="mt-4 w-full bg-gray-100 p-4 rounded">
                  <p className="text-sm font-semibold mb-2 text-gray-700">Preview:</p>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    layout="fill"
                    className="w-full max-h-64 object-contain border-2 border-blue-500 rounded bg-white"
                  />
                </div>
              )}
            </div>

            {/* Captions */}
            
              <div className="my-2">        <TextField
              label="Caption (English)"
              fullWidth
              rows={2}
              value={captionEn}
              onChange={(e) => setCaptionEn(e.target.value)}
              disabled={uploading}
            />
              </div>
            <div className="my-2"> 
            <TextField
              label="Caption (دری / Dari)"
              fullWidth
              rows={2}
              value={captionPrs}
              onChange={(e) => setCaptionPrs(e.target.value)}
              disabled={uploading}
              dir="rtl"
            />
              </div>      
            {/* Era Selection */}
            <FormControl fullWidth disabled={uploading}>
              <InputLabel>Era</InputLabel>
              <Select value={era} onChange={(e) => setEra(e.target.value)} label="Era">
                {ERA_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Custom Era Input */}
            {era === "Custom" && (
              <TextField
                label="Custom Era"
                fullWidth
                value={customEra}
                onChange={(e) => setCustomEra(e.target.value)}
                disabled={uploading}
                placeholder="e.g., Medieval Period, Ancient Times"
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={uploading}
            startIcon={uploading && <CircularProgress size={20} />}
          >
            {uploading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
