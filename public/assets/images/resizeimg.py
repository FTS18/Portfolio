from PIL import Image
import os

def resize_images(input_folder, output_folder, compression=0.3):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Loop through all files in the input folder
    for filename in os.listdir(input_folder):
        # Check if the file is an image
        if filename.endswith(('.png', '.jpg', '.jpeg', '.webp')):
            # Open the image file
            with Image.open(os.path.join(input_folder, filename)) as img:
                # Get the original width and height
                width, height = img.size
                # Calculate the new width and height while conserving aspect ratio
                new_width = int(width * compression)
                new_height = int(height * compression)
                # Resize the image
                img_resized = img.resize((new_width, new_height))
                # Determine the output format based on the input image format
                output_format = img.format.lower()
                # Save the resized image to the output folder
                img_resized.save(os.path.join(output_folder, filename), format=output_format)

# Example usage
input_folder = "screenshots"
output_folder = "resized_images"
resize_images(input_folder, output_folder)
