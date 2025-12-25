"use client";

import { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import { Delete, Add, CloudUpload } from "@mui/icons-material";
import Image from "next/image";
import { storage } from "@/utils/firebase-config";
import { ref, uploadBytes, deleteObject, listAll, getDownloadURL } from "firebase/storage";

interface HistoricImage {
  name: string;
  url: string;
  fullPath: string;
}

export default function HistoricImagesManager() {
  const [images, setImages] = useState<HistoricImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Fetch all images from Storage
  const fetchImages = async () => {
    try {
      setLoading(true);
      const storageRef = ref(storage, "historicalImages");
      const result = await listAll(storageRef);

      const imagePromises = result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          url,
          fullPath: itemRef.fullPath,
        };
      });

      const fetchedImages = await Promise.all(imagePromises);
      setImages(fetchedImages);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // Upload images
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one image");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      for (const file of selectedFiles) {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `historicalImages/${fileName}`);

        // Upload to Storage only
        await uploadBytes(storageRef, file);
      }

      setSuccess(`Successfully uploaded ${selectedFiles.length} image(s)!`);
      setSelectedFiles([]);
      await fetchImages();
    } catch (err) {
      console.error("Error uploading images:", err);
      setError("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const handleDelete = async (image: HistoricImage) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      setLoading(true);

      // Delete from Storage
      const imageRef = ref(storage, image.fullPath);
      await deleteObject(imageRef);

      setSuccess("Image deleted successfully!");
      await fetchImages();
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Historic Images Management
        </h2>
      </div>

      {/* Upload Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <div className="space-y-4">
            <input
              accept="image/*"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="historic-upload"
            />
            <div className="py-2">
              <Button
                variant="outlined"
                component="label"
                htmlFor="historic-upload"
                startIcon={<CloudUpload />}
                fullWidth
                disabled={uploading}
              >
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} file(s) selected`
                  : "Select Images"}
              </Button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative bg-gray-100 rounded">
                    <Image
                      src={URL.createObjectURL(file)}
                      width={500}
                      height={500}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="contained"
              startIcon={uploading ? <CircularProgress size={20} /> : <Add />}
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              fullWidth
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      )}

      {/* Images Grid */}
      {!loading && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Total images: {images.length}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <Card key={image.fullPath}>
                <div className="relative h-48">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
                <CardActions>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(image)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
