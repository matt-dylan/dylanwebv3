from PIL import Image, ImageDraw, ImageFont

def create_icon(variation_name, y_offset=0):
    # Create 256x256 icon
    size = 256
    img = Image.new('RGBA', (size, size), color=(10, 10, 15, 255))
    draw = ImageDraw.Draw(img)

    # Draw rounded rectangle with iOS-style radius (25% of size)
    radius = int(size * 0.25)
    draw.rounded_rectangle([0, 0, size-1, size-1], radius=radius, fill=(10, 10, 15, 255))

    # Use Arial Bold
    font = None
    for font_path in ["/System/Library/Fonts/Arial.ttf", "/Library/Fonts/Arial.ttf"]:
        try:
            font = ImageFont.truetype(font_path, 100)
            print(f"Using font: {font_path}")
            break
        except:
            continue

    if font is None:
        print("No custom font found")
        font = ImageFont.load_default()

    # Get text bounding box for centering
    bbox = draw.textbbox((0, 0), "DW", font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Calculate center position with y_offset
    x = (size - text_width) // 2
    y = (size - text_height) // 2 + y_offset

    # Draw text in blue
    draw.text((x, y), "DW", fill=(14, 165, 233, 255), font=font)

    # Save
    filename = f'/Users/dylanwhitlock/Documents/Projects/DylanWebV3/public/apple-touch-icon-{variation_name}.png'
    img.save(filename, 'PNG')
    print(f"✅ Saved: {filename}")

# Create variations with different y-offsets
create_icon('center', 0)          # Mathematical center
create_icon('higher_10', -10)     # 10px higher
create_icon('higher_20', -20)     # 20px higher  
create_icon('lower_5', 5)         # 5px lower

print("\nCreated 4 icon variations! Please test each one on your iPhone.")