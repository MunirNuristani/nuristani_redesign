#!/bin/bash

# Image Optimization Script for Nuristani.info
# This script converts images to WebP format and optimizes them

echo "🖼️  Image Optimization Script"
echo "=============================="

# Check if required tools are installed
command -v convert >/dev/null 2>&1 || { echo "❌ ImageMagick is required but not installed. Install with: brew install imagemagick"; exit 1; }

PUBLIC_DIR="./public"

# Function to optimize and convert to WebP
optimize_image() {
    local file=$1
    local filename=$(basename "$file")
    local extension="${filename##*.}"
    local basename="${filename%.*}"
    local webp_file="${file%.*}.webp"

    echo "📸 Processing: $filename"

    # Skip if already WebP
    if [ "$extension" = "webp" ]; then
        echo "   ✓ Already WebP format"
        return
    fi

    # Convert to WebP with quality 85
    convert "$file" -quality 85 -define webp:method=6 "$webp_file"

    if [ -f "$webp_file" ]; then
        original_size=$(du -h "$file" | cut -f1)
        webp_size=$(du -h "$webp_file" | cut -f1)
        echo "   ✓ Created WebP: $original_size → $webp_size"
    else
        echo "   ❌ Failed to create WebP"
    fi
}

# Find and process all images in public directory
echo ""
echo "🔍 Searching for images in $PUBLIC_DIR..."
echo ""

# Process JPG/JPEG files
find "$PUBLIC_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read file; do
    optimize_image "$file"
done

# Process PNG files
find "$PUBLIC_DIR" -type f -iname "*.png" | while read file; do
    optimize_image "$file"
done

echo ""
echo "✅ Optimization complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Update image references in your code to use .webp format"
echo "   2. Keep original images as fallback for older browsers"
echo "   3. Use Next.js Image component which handles format automatically"
echo ""
echo "Example usage:"
echo '   <Image src="/bg.jpg" ... /> // Next.js will serve .webp if available'
