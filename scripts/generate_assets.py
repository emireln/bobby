import os
from PIL import Image, ImageDraw, ImageFont

# Public output directory
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
os.makedirs(PUBLIC_DIR, exist_ok=True)

# 1. Generate Favicon SVG (Cloud in #ffffff with eyes)
# Values from BotEngine.sample(1) on 'nuage' shape
body_path = "M91.68 0.26C92.98 3.26 94 6.44 94.69 9.63C95.39 12.81 95.77 16.13 95.83 19.4C95.89 22.66 95.62 25.99 95.05 29.2C94.47 32.42 93.56 35.63 92.37 38.67C91.18 41.7 89.66 44.68 87.91 47.42C86.15 50.17 84.08 52.79 81.82 55.13C79.57 57.48 77.03 59.64 74.36 61.5C71.69 63.36 68.78 64.98 65.8 66.28C62.82 67.58 59.65 68.6 56.48 69.29C53.3 69.97 49.39 69.22 46.74 70.4C44.09 71.58 42.78 74.52 40.58 76.36C38.39 78.21 36.03 79.93 33.57 81.46C31.12 82.98 28.51 84.36 25.84 85.51C23.17 86.67 20.37 87.65 17.55 88.41C14.73 89.17 11.81 89.73 8.9 90.06C6 90.39 3.03 90.51 0.1 90.42C-2.82 90.32 -5.77 90 -8.64 89.47C-11.51 88.95 -14.37 88.2 -17.12 87.27C-19.87 86.33 -22.57 85.18 -25.14 83.86C-27.7 82.55 -30.16 80.98 -32.51 79.37C-34.86 77.77 -36.49 75.09 -39.24 74.23C-42 73.36 -45.79 74.48 -49.04 74.16C-52.28 73.84 -55.57 73.21 -58.73 72.29C-61.88 71.37 -65.01 70.14 -67.96 68.65C-70.91 67.17 -73.77 65.37 -76.41 63.35C-79.04 61.34 -81.53 59.04 -83.75 56.56C-85.97 54.09 -88 51.36 -89.73 48.51C-91.46 45.67 -92.96 42.61 -94.13 39.49C-95.31 36.37 -96.21 33.08 -96.79 29.8C-97.38 26.52 -97.66 23.13 -97.63 19.8C-97.6 16.47 -97.25 13.09 -96.61 9.84C-95.97 6.58 -95.02 3.33 -93.8 0.26C-92.58 -2.81 -91.06 -5.8 -89.31 -8.58C-87.57 -11.36 -85.53 -14.01 -83.33 -16.41C-81.13 -18.81 -78.05 -20.76 -76.11 -22.97C-74.17 -25.17 -72.55 -27.13 -71.7 -29.62C-70.85 -32.11 -71.48 -35.19 -71.01 -37.93C-70.54 -40.67 -69.83 -43.42 -68.88 -46.05C-67.94 -48.68 -66.75 -51.28 -65.36 -53.72C-63.97 -56.15 -62.34 -58.51 -60.54 -60.67C-58.74 -62.83 -56.72 -64.86 -54.57 -66.67C-52.42 -68.48 -50.07 -70.13 -47.64 -71.53C-45.21 -72.93 -42.61 -74.13 -39.98 -75.08C-37.34 -76.03 -34.59 -76.75 -31.84 -77.22C-29.09 -77.69 -26.26 -77.91 -23.49 -77.9C-20.72 -77.88 -17.92 -77.61 -15.21 -77.11C-12.51 -76.62 -9.82 -75.87 -7.27 -74.92C-4.71 -73.98 -2.22 -72.8 0.1 -71.45C2.43 -70.11 4.55 -68.04 6.68 -66.86C8.81 -65.68 10.62 -64.39 12.9 -64.38C15.18 -64.37 17.8 -66.21 20.35 -66.79C22.89 -67.37 25.55 -67.73 28.18 -67.84C30.81 -67.95 33.5 -67.82 36.12 -67.45C38.74 -67.08 41.38 -66.46 43.91 -65.61C46.43 -64.76 48.92 -63.67 51.26 -62.37C53.59 -61.07 55.85 -59.53 57.91 -57.82C59.97 -56.12 61.92 -54.18 63.63 -52.13C65.35 -50.07 66.91 -47.81 68.23 -45.47C69.54 -43.13 70.66 -40.63 71.52 -38.1C72.39 -35.56 73.03 -32.9 73.43 -30.25C73.82 -27.61 72.69 -24.63 73.87 -22.22C75.06 -19.81 78.37 -18.13 80.54 -15.81C82.71 -13.5 85.04 -11 86.9 -8.32C88.75 -5.65 90.38 -2.73 91.68 0.26Z"
eye1_matrix = "matrix(0.87,-0.33,0.45,0.84,14.44,-29.59)"
eye2_matrix = "matrix(0.64,-0.06,0.45,0.84,50.01,-41.24)"

favicon_svg = f"""<!-- bobby cloud avatar favicon (#ffffff) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-115 -115 230 230">
  <defs>
    <mask id="eyes">
      <path d="{body_path}" fill="#ffffff" />
      <path
        d="M-9.3 -11.3A9.3 9.3 0 0 1 0 -20.6L0 -20.6A9.3 9.3 0 0 1 9.3 -11.3L9.3 11.3A9.3 9.3 0 0 1 0 20.6L0 20.6A9.3 9.3 0 0 1 -9.3 11.3Z"
        transform="{eye1_matrix}"
        fill="#000000"
      />
      <path
        d="M-9.3 -11.3A9.3 9.3 0 0 1 0 -20.6L0 -20.6A9.3 9.3 0 0 1 9.3 -11.3L9.3 11.3A9.3 9.3 0 0 1 0 20.6L0 20.6A9.3 9.3 0 0 1 -9.3 11.3Z"
        transform="{eye2_matrix}"
        fill="#000000"
      />
    </mask>
  </defs>
  <rect x="-115" y="-115" width="230" height="230" rx="46" fill="#0a0a0c" />
  <path d="{body_path}" fill="#ffffff" mask="url(#eyes)" />
</svg>
"""

with open(os.path.join(PUBLIC_DIR, "favicon.svg"), "w", encoding="utf-8") as f:
    f.write(favicon_svg)
print("Saved favicon.svg")

# Helper function to draw cloud avatar using Pillow with supersampling
def render_cloud_avatar(size=512, bg_color=(10, 10, 12, 255), cloud_color=(255, 255, 255, 255), eye_color=(10, 10, 12, 255), round_bg=True):
    scale = 4  # 4x supersampling
    W = size * scale
    H = size * scale
    
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    if bg_color:
        if round_bg:
            r = int(W * 0.2)
            draw.rounded_rectangle([0, 0, W, H], radius=r, fill=bg_color)
        else:
            draw.rectangle([0, 0, W, H], fill=bg_color)
    
    # Cloud circles composition at center (W/2, H/2)
    # Radii in repere units (approx ~100) scaled to W
    cx, cy = W / 2, H / 2
    unit = (W * 0.42) / 100.0
    
    # Draw cloud body (union of multiple overlapping smooth circles)
    # { x: -0.44, y: 0.2, r: 0.54 }, { x: 0.46, y: 0.2, r: 0.5 }, { x: 0.02, y: 0.3, r: 0.6 },
    # { x: -0.24, y: -0.3, r: 0.48 }, { x: 0.3, y: -0.24, r: 0.44 }
    circles = [
        (-44, 20, 54),
        (46, 20, 50),
        (2, 30, 60),
        (-24, -30, 48),
        (30, -24, 44),
        # center fill
        (0, 0, 55)
    ]
    
    for ox, oy, rad in circles:
        px = cx + ox * unit
        py = cy + oy * unit
        pr = rad * unit * 1.02
        draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=cloud_color)
        
    # Draw two eyes (capsules/tilted rounded rects)
    # Eye 1: center around cx + 14*unit, cy - 30*unit
    e1_cx = cx + 16 * unit
    e1_cy = cy - 26 * unit
    e1_w = 9 * unit
    e1_h = 24 * unit
    
    # Eye 2: center around cx + 46*unit, cy - 38*unit
    e2_cx = cx + 48 * unit
    e2_cy = cy - 34 * unit
    e2_w = 7.5 * unit
    e2_h = 23 * unit
    
    # Draw tilted eye capsules using supersampled polygon or rotated image
    def draw_capsule(center_x, center_y, width, height, angle_deg, fill):
        # Create rotated capsule on scratch layer
        pad = int(max(width, height) * 2)
        c_img = Image.new("RGBA", (pad * 2, pad * 2), (0, 0, 0, 0))
        c_draw = ImageDraw.Draw(c_img)
        c_draw.rounded_rectangle([pad - width/2, pad - height/2, pad + width/2, pad + height/2], radius=width/2, fill=fill)
        rotated = c_img.rotate(angle_deg, resample=Image.BICUBIC)
        img.paste(rotated, (int(center_x - pad), int(center_y - pad)), rotated)

    draw_capsule(e1_cx, e1_cy, e1_w, e1_h, -24, eye_color)
    draw_capsule(e2_cx, e2_cy, e2_w, e2_h, -12, eye_color)
    
    return img.resize((size, size), Image.LANCZOS)

# 2. Generate Apple Touch Icon (180x180)
apple_icon = render_cloud_avatar(size=180, bg_color=(10, 10, 12, 255), cloud_color=(255, 255, 255, 255), eye_color=(10, 10, 12, 255), round_bg=False)
apple_icon.save(os.path.join(PUBLIC_DIR, "apple-touch-icon.png"), "PNG")
print("Saved apple-touch-icon.png")

# 3. Generate Favicon ICO (multi-size: 16, 32, 48)
ico_16 = render_cloud_avatar(size=16, bg_color=(10, 10, 12, 255), cloud_color=(255, 255, 255, 255), eye_color=(10, 10, 12, 255), round_bg=True)
ico_32 = render_cloud_avatar(size=32, bg_color=(10, 10, 12, 255), cloud_color=(255, 255, 255, 255), eye_color=(10, 10, 12, 255), round_bg=True)
ico_48 = render_cloud_avatar(size=48, bg_color=(10, 10, 12, 255), cloud_color=(255, 255, 255, 255), eye_color=(10, 10, 12, 255), round_bg=True)

ico_48.save(
    os.path.join(PUBLIC_DIR, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=[ico_32, ico_16]
)
print("Saved favicon.ico")

# 4. Generate Banner (1200 x 630)
def generate_banner():
    BW = 1200
    BH = 630
    banner = Image.new("RGBA", (BW, BH), (10, 10, 12, 255))
    draw = ImageDraw.Draw(banner)
    
    # Subtle gradient / glow effect on background
    for r in range(400, 0, -10):
        alpha = int(22 * (1 - r / 400))
        draw.ellipse([850 - r, 315 - r, 850 + r, 315 + r], fill=(50, 70, 130, alpha))
        
    # Render Avatar (size 340x340)
    avatar = render_cloud_avatar(size=340, bg_color=None, cloud_color=(255, 255, 255, 255), eye_color=(10, 10, 12, 255))
    banner.paste(avatar, (720, 145), avatar)
    
    # Try loading font or default
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 92)
        font_sub = ImageFont.truetype("arial.ttf", 34)
        font_tag = ImageFont.truetype("arialbd.ttf", 20)
    except Exception:
        try:
            font_title = ImageFont.truetype("DejaVuSans-Bold.ttf", 92)
            font_sub = ImageFont.truetype("DejaVuSans.ttf", 34)
            font_tag = ImageFont.truetype("DejaVuSans-Bold.ttf", 20)
        except Exception:
            font_title = ImageFont.load_default()
            font_sub = ImageFont.load_default()
            font_tag = ImageFont.load_default()

    # Pill badge
    draw.rounded_rectangle([100, 130, 290, 172], radius=20, fill=(30, 42, 70, 200), outline=(80, 110, 180, 120))
    draw.text((120, 140), "SVG AVATAR BOT", font=font_tag, fill=(130, 180, 255, 255))

    # Title: BOBBY
    draw.text((95, 190), "BOBBY", font=font_title, fill=(255, 255, 255, 255))
    
    # Description in English
    draw.text((100, 310), "Animated SVG Avatar recreation", font=font_sub, fill=(220, 230, 245, 255))
    draw.text((100, 360), "with 16 customizable shapes,", font=font_sub, fill=(160, 175, 200, 255))
    draw.text((100, 410), "24 expressions & timeline studio.", font=font_sub, fill=(160, 175, 200, 255))
    
    # Footer link
    draw.text((100, 510), "github.com/emireln/bobby", font=font_tag, fill=(100, 140, 210, 255))
    
    banner.save(os.path.join(PUBLIC_DIR, "banner.png"), "PNG")
    print("Saved banner.png")

generate_banner()

# Remove old og.png if exists
old_og = os.path.join(PUBLIC_DIR, "og.png")
if os.path.exists(old_og):
    os.remove(old_og)
    print("Removed old og.png")
