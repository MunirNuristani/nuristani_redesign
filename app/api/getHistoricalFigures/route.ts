import { storage } from "@/utils/firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";

export async function GET() {
  try {
    // Check if storage is initialized
    if (!storage) {
      console.error("Firebase storage not initialized");
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all file references from the historicalFigures folder
    const storageRef = ref(storage, 'historicalFigures');
    const listResult = await listAll(storageRef);

    // If folder is empty, return empty array
    if (!listResult.items || listResult.items.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get download URLs for all files with individual error handling
    const figureDataPromises = listResult.items.map(async (itemRef) => {
      try {
        const downloadURL = await getDownloadURL(itemRef);

        // Extract name from filename (remove extension and replace underscores/dashes with spaces)
        const nameFromFile = itemRef.name
          .replace(/\.[^/.]+$/, "") // Remove file extension
          .replace(/[-_]/g, " ") // Replace dashes and underscores with spaces
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");

        return {
          name: nameFromFile,
          imageUrl: downloadURL,
          path: itemRef.fullPath,
          fileName: itemRef.name
        };
      } catch (error) {
        console.error(`Error fetching URL for ${itemRef.name}:`, error);
        return null; // Skip this image if there's an error
      }
    });

    const figureData = await Promise.all(figureDataPromises);

    // Filter out null values (failed downloads)
    const validFigures = figureData.filter(figure => figure !== null);

    return new Response(JSON.stringify(validFigures), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    console.error("Error fetching historical figures:", err);

    // Return empty array instead of error to prevent page crash
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
