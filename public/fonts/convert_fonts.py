"""
Convert OTF fonts to WOFF2 format
Requires: pip install fonttools brotli
"""
from fontTools.ttLib import TTFont
import os

def convert_otf_to_woff2(input_file):
    """Convert OTF to WOFF2"""
    output_file = input_file.replace('.otf', '.woff2').replace('.OTF', '.woff2')
    
    print(f"Converting: {input_file} -> {output_file}")
    
    try:
        font = TTFont(input_file)
        font.flavor = 'woff2'
        font.save(output_file)
        
        # Get file sizes
        original_size = os.path.getsize(input_file)
        new_size = os.path.getsize(output_file)
        savings = ((original_size - new_size) / original_size) * 100
        
        print(f"  ✅ Done! {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB ({savings:.1f}% smaller)")
        return True
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

if __name__ == "__main__":
    fonts = [
        "MonumentExtended.otf",
        "MonumentExtended-Ultrabold.otf"
    ]
    
    for font in fonts:
        if os.path.exists(font):
            convert_otf_to_woff2(font)
        else:
            print(f"  ⚠️ File not found: {font}")
    
    print("\n✅ Conversion complete!")
