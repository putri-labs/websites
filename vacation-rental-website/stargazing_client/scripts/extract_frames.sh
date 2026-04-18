#!/bin/bash

# A script to extract a high-framerate drone video into individual webp frames
# Usage: ./extract_frames.sh <input_video.mp4> [output_directory] [fps]

INPUT_VIDEO=$1
OUTPUT_DIR=${2:-"../public/assets/drone"}
FPS=${3:-30}
QUALITY=${4:-80} # WebP quality rating

if [ -z "$INPUT_VIDEO" ]; then
  echo "Usage: ./extract_frames.sh <input_video.mp4> [output_directory] [fps]"
  echo "Example: ./extract_frames.sh drone-shot.mp4 ../public/assets/drone 30"
  exit 1
fi

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

echo "Extracting frames at $FPS FPS to $OUTPUT_DIR/drone-%03d.webp..."
echo "Compressing with webp quality level $QUALITY..."

# Use ffmpeg to extract frames and compress to webp
# -vcodec libwebp: Use WebP encoder
# -lossless 0: Use lossy compression for smaller file sizes
# -compression_level 6: Max compression effort (slower but smaller)
# -q:v $QUALITY: Quality rating (0-100)
ffmpeg -i "$INPUT_VIDEO" \
       -vf "fps=$FPS,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
       -vcodec libwebp -lossless 0 -compression_level 6 -q:v "$QUALITY" \
       "$OUTPUT_DIR/drone-%03d.webp"

echo "Done! The frames are ready for the Canvas Scrollytelling engine."
