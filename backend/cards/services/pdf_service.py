import os
from io import BytesIO
from django.core.files.base import ContentFile
from django.conf import settings
from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor

def get_theme_colors(theme):
    """
    Returns primary, secondary, and background HexColors for the PDF based on the theme.
    """
    if theme == 'professional_blue':
        # Professional Blue palette
        primary = HexColor("#1E3A8A")     # Deep blue
        accent = HexColor("#3B82F6")      # Bright blue
        bg = HexColor("#F8FAFC")          # Light grey/blue
        text = HexColor("#1E293B")        # Slate 800
        muted = HexColor("#64748B")       # Slate 500
    elif theme == 'executive_dark':
        # Luxury executive dark palette
        primary = HexColor("#111827")     # Charcoal/black
        accent = HexColor("#EAB308")      # Gold
        bg = HexColor("#1F2937")          # Dark slate
        text = HexColor("#F9FAFB")        # Off white
        muted = HexColor("#9CA3AF")       # Slate grey
    elif theme == 'modern_purple':
        # Modern vibrant purple palette
        primary = HexColor("#4C1D95")     # Dark purple
        accent = HexColor("#8B5CF6")      # Bright purple
        bg = HexColor("#FAF5FF")          # Very light purple/white
        text = HexColor("#1E1B4B")        # Indigo 900
        muted = HexColor("#7C3AED")       # Medium violet
    else:
        primary = HexColor("#000000")
        accent = HexColor("#333333")
        bg = HexColor("#FFFFFF")
        text = HexColor("#000000")
        muted = HexColor("#666666")
        
    return primary, accent, bg, text, muted

def draw_business_card_front(c, x, y, width, height, card, colors):
    """
    Draws a premium two-tone split front side of the business card.
    Left 1/3 is dark themed primary color, right 2/3 is theme accent background.
    """
    primary, accent, bg, text_color, muted = colors
    
    c.saveState()
    
    # Clip path to card rounded corners
    path = c.beginPath()
    path.roundRect(x, y, width, height, 4 * mm)
    c.clipPath(path, stroke=1, fill=0)
    
    # Fill left panel (dark primary color)
    c.setFillColor(primary)
    c.rect(x, y, 25 * mm, height, fill=1, stroke=0)
    
    # Fill right panel (light theme background)
    c.setFillColor(bg)
    c.rect(x + 25 * mm, y, width - 25 * mm, height, fill=1, stroke=0)
    
    # Thin divider accent line
    c.setStrokeColor(accent)
    c.setLineWidth(1)
    c.line(x + 25 * mm, y, x + 25 * mm, y + height)
    
    # Profile Photo / Logo (in the left panel)
    pic_size = 15 * mm
    pic_x = x + (25 * mm - pic_size) / 2
    pic_y = y + height - 21 * mm
    
    if not card.photo:
        # Draw initials placeholder in a clean rounded rectangle
        c.setFillColor(accent)
        c.roundRect(pic_x, pic_y, pic_size, pic_size, 2.5 * mm, fill=1, stroke=0)
        
        c.setFillColor(HexColor("#FFFFFF"))
        c.setFont("Helvetica-Bold", 11)
        initials = "".join([part[0] for part in card.name.split()[:2]]).upper()
        c.drawCentredString(pic_x + pic_size/2, pic_y + pic_size/2 - 3.5, initials)
    else:
        try:
            # Draw and clip photo to rounded rectangle
            c.saveState()
            clip_path = c.beginPath()
            clip_path.roundRect(pic_x, pic_y, pic_size, pic_size, 2.5 * mm)
            c.clipPath(clip_path, stroke=0, fill=0)
            
            c.drawImage(card.photo.path, pic_x, pic_y, width=pic_size, height=pic_size, mask='auto')
            c.restoreState()
            
            # Subtle border around the logo
            c.setStrokeColor(HexColor("#E2E8F0"))
            c.setLineWidth(0.5)
            c.roundRect(pic_x, pic_y, pic_size, pic_size, 2.5 * mm, fill=0, stroke=1)
        except Exception:
            c.setFillColor(accent)
            c.roundRect(pic_x, pic_y, pic_size, pic_size, 2.5 * mm, fill=1, stroke=0)
            
    # Text details (in the right panel, starting at x + 29 * mm)
    text_x = x + 29 * mm
    
    # Font size scaler based on Name length
    name_str = card.name[:30]
    if len(name_str) > 22:
        c.setFont("Helvetica-Bold", 8.5)
    elif len(name_str) > 16:
        c.setFont("Helvetica-Bold", 10.5)
    else:
        c.setFont("Helvetica-Bold", 12.5)
    c.setFillColor(text_color)
    c.drawString(text_x, y + height - 12 * mm, name_str)
    
    # Designation
    desig_str = card.designation
    if card.department:
        desig_str = f"{desig_str} | {card.department}"
    desig_str = desig_str[:40]
    
    if len(desig_str) > 28:
        c.setFont("Helvetica-Bold", 6.0)
    else:
        c.setFont("Helvetica-Bold", 7.0)
    c.setFillColor(accent)
    c.drawString(text_x, y + height - 17 * mm, desig_str)
    
    # Company
    comp_str = card.company[:35]
    if len(comp_str) > 28:
        c.setFont("Helvetica", 6.0)
    else:
        c.setFont("Helvetica", 7.0)
    c.setFillColor(muted)
    c.drawString(text_x, y + height - 22 * mm, comp_str)
    
    # Horizontal line
    c.setStrokeColor(HexColor("#E2E8F0"))
    c.setLineWidth(0.5)
    c.line(text_x, y + height - 25 * mm, x + width - 6 * mm, y + height - 25 * mm)
    
    # Contact Details on Bottom Right
    c.setFillColor(text_color)
    c.setFont("Helvetica", 7.0)
    
    c.drawString(text_x, y + 17 * mm, f"Tel: {card.phone}")
    c.drawString(text_x, y + 12 * mm, f"Email: {card.email}")
    
    web_str = card.portfolio_url if card.portfolio_url else card.address
    if web_str:
        web_str = web_str.replace("https://", "").replace("http://", "")[:35]
        label = "Web:" if card.portfolio_url else "Loc:"
        c.drawString(text_x, y + 7 * mm, f"{label} {web_str}")
        
    c.restoreState()

def draw_business_card_back(c, x, y, width, height, card, colors):
    """
    Draws the back side of the business card containing the centered large QR code.
    """
    primary, accent, bg, text_color, muted = colors
    
    c.saveState()
    c.setStrokeColor(primary)
    c.setLineWidth(1)
    
    # Fill background (mostly theme primary for premium feel)
    c.setFillColor(primary)
    c.roundRect(x, y, width, height, 4 * mm, fill=1, stroke=1)
    
    # QR Code Frame (centered rounded white box)
    qr_box_size = 32 * mm
    qr_box_x = x + (width - qr_box_size) / 2
    qr_box_y = y + (height - qr_box_size) / 2
    
    c.setFillColor(HexColor("#FFFFFF"))
    c.roundRect(qr_box_x, qr_box_y, qr_box_size, qr_box_size, 3 * mm, fill=1, stroke=0)
    
    # Insert hybrid/online QR image
    if card.hybrid_qr:
        try:
            c.drawImage(card.hybrid_qr.path, qr_box_x + 1.5*mm, qr_box_y + 1.5*mm, width=qr_box_size - 3*mm, height=qr_box_size - 3*mm)
        except Exception:
            c.setFillColor(HexColor("#CCCCCC"))
            c.rect(qr_box_x + 2*mm, qr_box_y + 2*mm, qr_box_size - 4*mm, qr_box_size - 4*mm, fill=1, stroke=0)
            
    # Text Brand details (centered vertically above and below QR code)
    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(x + width/2, y + height - 7 * mm, "QRConnect")
    
    c.setFillColor(accent)
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(x + width/2, y + 4 * mm, "Your Digital Identity in One Scan")
    
    c.restoreState()

def generate_card_pdf(card):
    """
    Generates a high-quality printable PDF document for the card:
    - Page 1: Single Business Card Front and Back stacked.
    - Page 2: A4 Printable sheet with crop marks.
    Updates and saves to card.pdf_file.
    """
    buffer = BytesIO()
    
    # Create the document with A4 page size
    c = canvas.Canvas(buffer, pagesize=A4)
    width_a4, height_a4 = A4
    
    # Business card dimensions
    card_w = 85.6 * mm
    card_h = 53.98 * mm
    
    # Get colors based on theme
    colors = get_theme_colors(card.theme)
    primary, accent, bg, text_color, muted = colors
    
    # ================= PAGE 1: Card Overview =================
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(primary)
    c.drawString(20 * mm, height_a4 - 25 * mm, "QRConnect Digital Business Card")
    
    c.setFont("Helvetica", 10)
    c.setFillColor(muted)
    c.drawString(20 * mm, height_a4 - 32 * mm, f"Prepared for {card.name} ({card.company}) - Theme: {card.theme.replace('_', ' ').title()}")
    
    # Draw Front Side
    front_x = (width_a4 - card_w) / 2
    front_y = height_a4 - 110 * mm
    draw_business_card_front(c, front_x, front_y, card_w, card_h, card, colors)
    
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(muted)
    c.drawCentredString(width_a4/2, front_y - 6 * mm, "CARD FRONT")
    
    # Draw Back Side
    back_x = (width_a4 - card_w) / 2
    back_y = height_a4 - 190 * mm
    draw_business_card_back(c, back_x, back_y, card_w, card_h, card, colors)
    c.drawCentredString(width_a4/2, back_y - 6 * mm, "CARD BACK")
    
    # Footer info Page 1
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(muted)
    c.drawCentredString(width_a4/2, 15 * mm, "Generated automatically by QRConnect platform. Page 1 of 2")
    
    # Show Page (triggers page break)
    c.showPage()
    
    # ================= PAGE 2: A4 Print Ready Sheet =================
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(primary)
    c.drawString(20 * mm, height_a4 - 25 * mm, "Print Ready A4 Template")
    
    c.setFont("Helvetica", 9)
    c.setFillColor(muted)
    c.drawString(20 * mm, height_a4 - 32 * mm, "Print at 100% scale. Cut along outer solid lines, fold along dashed lines.")
    
    # Center coordinates of the print template
    # Draw Front and Back side-by-side with crop marks
    gap = 10 * mm
    center_y = height_a4 / 2 - card_h / 2
    
    # Total width of front + back + gap
    total_w = card_w * 2 + gap
    start_x = (width_a4 - total_w) / 2
    
    # Draw crop marks / cut lines
    c.setStrokeColor(HexColor("#94A3B8"))
    c.setLineWidth(0.5)
    
    # Front Card
    draw_business_card_front(c, start_x, center_y, card_w, card_h, card, colors)
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(muted)
    c.drawCentredString(start_x + card_w/2, center_y - 6 * mm, "Front (Cut & Fold)")
    
    # Back Card
    draw_business_card_back(c, start_x + card_w + gap, center_y, card_w, card_h, card, colors)
    c.drawCentredString(start_x + card_w + gap + card_w/2, center_y - 6 * mm, "Back (Cut & Fold)")
    
    # Draw dotted fold guidelines or cutting guides around cards
    c.saveState()
    c.setStrokeColor(HexColor("#CBD5E1"))
    c.setLineWidth(0.5)
    c.setDash(2, 2)
    # Guidelines to help alignment
    c.rect(start_x - 5*mm, center_y - 5*mm, card_w*2 + gap + 10*mm, card_h + 10*mm, fill=0, stroke=1)
    c.restoreState()
    
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(muted)
    c.drawCentredString(width_a4/2, 15 * mm, "Generated automatically by QRConnect platform. Page 2 of 2")
    
    # Save PDF Document
    c.save()
    
    buffer.seek(0)
    filename = f"card_{card.slug}.pdf"
    
    if card.pdf_file:
        old_path = card.pdf_file.path
        if os.path.exists(old_path):
            os.remove(old_path)
            
    card.pdf_file.save(filename, ContentFile(buffer.getvalue()), save=False)
    return card.pdf_file
