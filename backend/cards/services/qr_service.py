import os
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from django.conf import settings
from .vcf_service import generate_vcard_content

def get_theme_color(theme):
    """
    Returns a hex color for the QR code fill based on the theme.
    Use dark colors to ensure high contrast and excellent scannability.
    """
    if theme == 'professional_blue':
        return "#1E40AF"  # Deep blue
    elif theme == 'executive_dark':
        return "#111827"  # Very dark gray/black
    elif theme == 'modern_purple':
        return "#6D28D9"  # Deep purple
    return "#000000"

def generate_single_qr(data, fill_color, filename):
    """
    Generates a QR code image file from data and returns a ContentFile.
    """
    qr = qrcode.QRCode(
        version=None,  # Automatically detect version size
        error_correction=qrcode.constants.ERROR_CORRECT_M,  # Medium error correction
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    # Create the image with PIL
    img = qr.make_image(fill_color=fill_color, back_color="white")
    
    # Save to memory buffer
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    
    return ContentFile(buffer.getvalue(), name=filename)

def generate_all_qrs(card, profile_url):
    """
    Generates and saves Offline, Online, and Hybrid QR codes for the card.
    profile_url is the full URL to the public profile page.
    """
    fill_color = get_theme_color(card.theme)
    
    # 1. Offline QR (VCard without profile URL link)
    offline_vcard = generate_vcard_content(card, online_url=None)
    offline_filename = f"qr_offline_{card.slug}.png"
    
    if card.offline_qr:
        old_path = card.offline_qr.path
        if os.path.exists(old_path):
            os.remove(old_path)
    
    offline_file_content = generate_single_qr(offline_vcard, fill_color, offline_filename)
    card.offline_qr.save(offline_filename, offline_file_content, save=False)
    
    # 2. Online QR (Only the web link)
    online_filename = f"qr_online_{card.slug}.png"
    
    if card.online_qr:
        old_path = card.online_qr.path
        if os.path.exists(old_path):
            os.remove(old_path)
            
    online_file_content = generate_single_qr(profile_url, fill_color, online_filename)
    card.online_qr.save(online_filename, online_file_content, save=False)
    
    # 3. Hybrid QR (VCard including the profile URL link)
    hybrid_vcard = generate_vcard_content(card, online_url=profile_url)
    hybrid_filename = f"qr_hybrid_{card.slug}.png"
    
    if card.hybrid_qr:
        old_path = card.hybrid_qr.path
        if os.path.exists(old_path):
            os.remove(old_path)
            
    hybrid_file_content = generate_single_qr(hybrid_vcard, fill_color, hybrid_filename)
    card.hybrid_qr.save(hybrid_filename, hybrid_file_content, save=False)
    
    return card
