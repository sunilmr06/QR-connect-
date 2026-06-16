import os
from PIL import Image, ImageDraw, ImageFont, ImageOps
from io import BytesIO
from django.core.files.base import ContentFile
from django.conf import settings

def load_fonts(bold_size, regular_size):
    """
    Attempts to load standard Windows system fonts, falling back to PIL's default.
    """
    font_paths = [
        ("segoeuib.ttf", "segoeui.ttf"),  # Segoe UI Bold / Regular
        ("arialbd.ttf", "arial.ttf"),    # Arial Bold / Regular
    ]
    
    win_font_dir = "C:\\Windows\\Fonts\\"
    
    for bold_name, reg_name in font_paths:
        bp = os.path.join(win_font_dir, bold_name)
        rp = os.path.join(win_font_dir, reg_name)
        if os.path.exists(bp) and os.path.exists(rp):
            try:
                bold_font = ImageFont.truetype(bp, bold_size)
                reg_font = ImageFont.truetype(rp, regular_size)
                return bold_font, reg_font
            except Exception:
                pass
                
    default = ImageFont.load_default()
    return default, default

def get_gradient_background(width, height, theme):
    """
    Creates a beautiful gradient background image based on the selected theme.
    """
    base = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(base)
    
    if theme == 'professional_blue':
        color_start = (15, 23, 42)    # Slate 900
        color_end = (30, 58, 138)     # Blue 900
    elif theme == 'executive_dark':
        color_start = (17, 24, 39)    # Gray 900
        color_end = (3, 7, 18)        # Gray 950
    elif theme == 'modern_purple':
        color_start = (59, 7, 100)    # Purple 950
        color_end = (88, 28, 135)     # Purple 900
    else:
        color_start = (0, 0, 0)
        color_end = (30, 30, 30)

    for y in range(height):
        r = int(color_start[0] + (color_end[0] - color_start[0]) * (y / height))
        g = int(color_start[1] + (color_end[1] - color_start[1]) * (y / height))
        b = int(color_start[2] + (color_end[2] - color_start[2]) * (y / height))
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    return base

def generate_social_card_png(card):
    """
    Generates a premium 1080x1080 social media card styled like a high-end Instagram post.
    Splits the card mockup horizontally to prevent any text overlaps.
    Saves and updates card.png_file.
    """
    width, height = 1080, 1080
    img = get_gradient_background(width, height, card.theme)
    draw = ImageDraw.Draw(img)
    
    # Load fonts
    font_large_title, _ = load_fonts(bold_size=64, regular_size=24)
    font_name, font_sub = load_fonts(bold_size=38, regular_size=24)
    font_body, font_small = load_fonts(bold_size=24, regular_size=20)
    font_brand, _ = load_fonts(bold_size=20, regular_size=20)
    
    # Theme colors for typography and borders
    if card.theme == 'professional_blue':
        accent_color = (96, 165, 250)      # Light Blue (Blue 400)
        card_bg = (30, 41, 59, 190)        # Semi-transparent Slate 800
        border_color = (51, 65, 85)        # Slate 700
    elif card.theme == 'executive_dark':
        accent_color = (234, 179, 8)       # Gold
        card_bg = (17, 24, 39, 225)        # Semi-transparent Gray 900
        border_color = (75, 85, 99)        # Gray 600
    elif card.theme == 'modern_purple':
        accent_color = (192, 132, 252)     # Light Purple
        card_bg = (24, 18, 43, 200)        # Semi-transparent Dark Violet
        border_color = (109, 40, 217)      # Violet 700
    else:
        accent_color = (255, 255, 255)
        card_bg = (40, 40, 40, 200)
        border_color = (80, 80, 80)
        
    # Draw central horizontal card mockup container (Instagram post card style)
    card_w = 940
    card_h = 540
    card_left = (width - card_w) // 2
    card_top = 270
    card_right = card_left + card_w
    card_bottom = card_top + card_h
    
    # Create glassmorphic card overlay
    overlay = Image.new("RGBA", (width, height), (0,0,0,0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rounded_rectangle(
        [(card_left, card_top), (card_right, card_bottom)],
        radius=36,
        fill=card_bg,
        outline=border_color,
        width=3
    )
    img = Image.alpha_composite(img.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(img)
    
    # LEFT HALF: Profile + Text details (width: x = card_left to x = card_left + 540)
    # 1. Profile Photo
    photo_size = 140
    photo_left = card_left + 50
    photo_top = card_top + 50
    
    photo_mask = Image.new("L", (photo_size, photo_size), 0)
    mask_draw = ImageDraw.Draw(photo_mask)
    mask_draw.rounded_rectangle((0, 0, photo_size, photo_size), radius=20, fill=255)
    
    photo_placeholder = Image.new("RGB", (photo_size, photo_size), accent_color)
    p_draw = ImageDraw.Draw(photo_placeholder)
    
    initials = "".join([part[0] for part in card.name.split()[:2]]).upper()
    font_initials, _ = load_fonts(bold_size=56, regular_size=24)
    
    try:
        w, h = p_draw.textsize(initials, font=font_initials)
    except AttributeError:
        bbox = p_draw.textbbox((0, 0), initials, font=font_initials)
        w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    p_draw.text(((photo_size-w)//2, (photo_size-h)//2 - 6), initials, fill=(255,255,255), font=font_initials)
    
    final_photo_img = photo_placeholder
    
    if card.photo:
        try:
            user_photo = Image.open(card.photo.path)
            user_photo = ImageOps.fit(user_photo, (photo_size, photo_size), Image.Resampling.LANCZOS)
            final_photo_img = user_photo
        except Exception:
            pass
            
    img.paste(final_photo_img, (photo_left, photo_top), photo_mask)
    draw.rounded_rectangle(
        [(photo_left - 3, photo_top - 3), (photo_left + photo_size + 3, photo_top + photo_size + 3)],
        radius=23,
        fill=None,
        outline=accent_color,
        width=3
    )
    
    # 2. Text Stack (Name, designation, company) next to photo
    text_left = photo_left + photo_size + 30
    name_top = photo_top + 10
    
    # Draw Name
    name_str = card.name[:24]
    draw.text((text_left, name_top), name_str, fill=(255, 255, 255), font=font_name)
    
    # Draw Designation
    desig_str = card.designation
    if card.department:
        desig_str = f"{desig_str}, {card.department}"
    desig_str = desig_str[:32]
    draw.text((text_left, name_top + 55), desig_str, fill=accent_color, font=font_small)
    
    # Draw Company
    draw.text((text_left, name_top + 90), card.company[:32], fill=(209, 213, 219), font=font_small)
    
    # 3. Horizontal line separating bio from contact info
    divider_y = photo_top + photo_size + 40
    draw.line([(photo_left, divider_y), (card_left + 540, divider_y)], fill=border_color, width=1)
    
    # 4. Contact Details on Bottom Left (Phone, Email, Website)
    contact_y = divider_y + 30
    draw.text((photo_left, contact_y), f"Phone:  {card.phone}", fill=(243, 244, 246), font=font_body)
    
    # Prevent long emails from running over
    email_str = card.email[:32]
    draw.text((photo_left, contact_y + 45), f"Email:  {email_str}", fill=(243, 244, 246), font=font_body)
    
    web_str = card.portfolio_url if card.portfolio_url else card.address
    if web_str:
        web_str = web_str.replace("https://", "").replace("http://", "")[:32]
        label = "Web:" if card.portfolio_url else "Loc:"
        draw.text((photo_left, contact_y + 90), f"{label}   {web_str}", fill=(243, 244, 246), font=font_body)
        
    # RIGHT HALF: Large QR Code (completely separated from left half!)
    # White box is 320x320 centered in the right section (x = card_left + 570 to card_right - 50)
    qr_box_size = 320
    qr_box_left = card_right - qr_box_size - 50
    qr_box_top = card_top + (card_h - qr_box_size) // 2
    
    draw.rounded_rectangle(
        [(qr_box_left, qr_box_top), (qr_box_left + qr_box_size, qr_box_top + qr_box_size)],
        radius=24,
        fill=(255, 255, 255)
    )
    
    # Draw actual hybrid QR code
    qr_img_size = qr_box_size - 40
    qr_left = qr_box_left + 20
    qr_top = qr_box_top + 20
    
    if card.hybrid_qr:
        try:
            qr_img = Image.open(card.hybrid_qr.path)
            qr_img = qr_img.resize((qr_img_size, qr_img_size), Image.Resampling.LANCZOS)
            img.paste(qr_img, (qr_left, qr_top))
        except Exception:
            # Fallback placeholder
            draw.rectangle([(qr_left, qr_top), (qr_left + qr_img_size, qr_top + qr_img_size)], fill=(220, 220, 220))
            
    # Draw Instagram post headers/footers
    # Post Heading
    post_title = "QRConnect"
    try:
        w_title, _ = draw.textsize(post_title, font=font_large_title)
    except AttributeError:
        bbox = draw.textbbox((0, 0), post_title, font=font_large_title)
        w_title, _ = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((width - w_title)//2, 80), post_title, fill=(255, 255, 255), font=font_large_title)
    
    tagline = "Your Digital Identity in One Scan"
    try:
        w_tag, _ = draw.textsize(tagline, font=font_sub)
    except AttributeError:
        bbox = draw.textbbox((0, 0), tagline, font=font_sub)
        w_tag, _ = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((width - w_tag)//2, 170), tagline, fill=accent_color, font=font_sub)
    
    # Bottom Instruction Footnote
    instruction = "Scan QR to view full digital profile and save contact card"
    try:
        w_inst, _ = draw.textsize(instruction, font=font_small)
    except AttributeError:
        bbox = draw.textbbox((0, 0), instruction, font=font_small)
        w_inst, _ = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((width - w_inst)//2, card_bottom + 60), instruction, fill=(156, 163, 175), font=font_small)
    
    # Save Image
    buffer = BytesIO()
    img.convert("RGB").save(buffer, format="JPEG", quality=95)
    buffer.seek(0)
    
    filename = f"social_{card.slug}.jpg"
    
    if card.png_file:
        old_path = card.png_file.path
        if os.path.exists(old_path):
            os.remove(old_path)
            
    card.png_file.save(filename, ContentFile(buffer.getvalue()), save=False)
    return card.png_file
