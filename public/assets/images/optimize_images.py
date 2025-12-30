"""
Image Optimization Script for Portfolio
Generates compressed thumbnails for faster loading

Usage:
  python optimize_images.py

Requirements:
  pip install Pillow
"""

from PIL import Image
import os
import sys

# Configuration
BASE_FOLDER = "."  # Base images folder
THUMB_FOLDER = "thumbs"
THUMB_MAX_WIDTH = 400  # Max width for thumbnails (cards use 400px)
THUMB_QUALITY = 75  # WebP quality (0-100)

# Folders to process (relative to BASE_FOLDER)
FOLDERS_TO_PROCESS = [
    ".",           # Main images folder
    "screenshots", # Screenshots subfolder
]

def get_image_files(folder):
    """Get all image files in the folder"""
    extensions = ('.png', '.jpg', '.jpeg', '.webp', '.gif')
    files = []
    if not os.path.exists(folder):
        return files
    for f in os.listdir(folder):
        filepath = os.path.join(folder, f)
        if os.path.isfile(filepath) and f.lower().endswith(extensions) and not f.startswith('.'):
            files.append(f)
    return files

def optimize_image(input_path, output_path, max_width=None, quality=85):
    """Resize and compress an image"""
    try:
        with Image.open(input_path) as img:
            # Convert RGBA to RGB for JPEG
            if img.mode in ('RGBA', 'P') and output_path.lower().endswith('.jpg'):
                img = img.convert('RGB')
            
            original_size = os.path.getsize(input_path)
            
            if max_width and img.width > max_width:
                # Calculate new height maintaining aspect ratio
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.LANCZOS)
            
            # Save with optimization
            if output_path.lower().endswith('.webp'):
                img.save(output_path, 'WEBP', quality=quality, method=6)
            elif output_path.lower().endswith('.png'):
                img.save(output_path, 'PNG', optimize=True)
            else:
                img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            new_size = os.path.getsize(output_path)
            savings = ((original_size - new_size) / original_size) * 100
            
            return {
                'original': original_size,
                'new': new_size,
                'savings': savings
            }
    except Exception as e:
        print(f"Error processing {input_path}: {e}")
        return None

def main():
    print("=" * 50)
    print("Portfolio Image Optimizer")
    print("=" * 50)
    
    total_original = 0
    total_new = 0
    total_count = 0
    
    for folder in FOLDERS_TO_PROCESS:
        folder_path = folder if folder == "." else folder
        
        # Create thumbs folder for this path
        if folder == ".":
            thumb_output = THUMB_FOLDER
        else:
            thumb_output = os.path.join(THUMB_FOLDER, folder)
        
        if not os.path.exists(thumb_output):
            os.makedirs(thumb_output)
            print(f"Created folder: {thumb_output}")
        
        # Get all images in this folder
        images = get_image_files(folder_path)
        
        if not images:
            print(f"\nNo images found in: {folder_path}")
            continue
            
        print(f"\n[{folder_path}] Found {len(images)} images")
        
        for i, filename in enumerate(images, 1):
            input_path = os.path.join(folder_path, filename)
            
            # Generate thumbnail (WebP format for best compression)
            thumb_name = os.path.splitext(filename)[0] + '.webp'
            thumb_path = os.path.join(thumb_output, thumb_name)
            
            print(f"  [{i}/{len(images)}] {filename}")
            
            result = optimize_image(input_path, thumb_path, THUMB_MAX_WIDTH, THUMB_QUALITY)
            
            if result:
                total_original += result['original']
                total_new += result['new']
                total_count += 1
                
                orig_kb = result['original'] / 1024
                new_kb = result['new'] / 1024
                print(f"    → {orig_kb:.1f}KB → {new_kb:.1f}KB ({result['savings']:.1f}% saved)")
    
    # Summary
    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    print(f"Total images processed: {total_count}")
    print(f"Total original: {total_original / 1024 / 1024:.2f} MB")
    print(f"Total new:      {total_new / 1024 / 1024:.2f} MB")
    if total_original > 0:
        total_savings = ((total_original - total_new) / total_original) * 100
        print(f"Total savings:  {total_savings:.1f}%")
    print(f"\nThumbnails saved to: {THUMB_FOLDER}/")
    print(f"  - thumbs/          (main images)")
    print(f"  - thumbs/screenshots/ (screenshot images)")

if __name__ == "__main__":
    main()
