from PIL import Image

img = Image.open("logo.jpg")
w, h = img.size
print("Width:", w)
print("Height:", h)

# Adjust this value if needed to remove the black bar entirely
crop_top = int(h * 0.67)  # Start crop below the black bar (about 2/3 down)
crop_bottom = h

# Bottom left (white logo on black)
logo_black = img.crop((0, crop_top, w // 2, crop_bottom))
logo_black.save("logo-black.png")

# Bottom right (black logo on white)
logo_white = img.crop((w // 2, crop_top, w, crop_bottom))
logo_white.save("logo-white.png")