import os
from django.conf import settings
from django.core.files.base import ContentFile

def generate_vcard_content(card, online_url=None):
    """
    Generates a VCARD 3.0 string representation of the card details.
    If online_url is provided, it is included as the primary URL.
    """
    lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
    ]
    
    # Name fields
    # Format N: LastName;FirstName;MiddleName;Prefix;Suffix
    parts = card.name.split(" ", 1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else ""
    lines.append(f"N:{last_name};{first_name};;;")
    lines.append(f"FN:{card.name}")
    
    # Organization and Title
    org = card.company
    if card.department:
        org = f"{org};{card.department}"
    lines.append(f"ORG:{org}")
    lines.append(f"TITLE:{card.designation}")
    
    # Contact methods
    if card.phone:
        lines.append(f"TEL;TYPE=CELL,VOICE:{card.phone}")
    if card.email:
        lines.append(f"EMAIL;TYPE=PREF,INTERNET:{card.email}")
        
    # Address
    if card.address:
        # Escape commas and semi-colons
        safe_addr = card.address.replace(";", "\\;").replace(",", "\\,")
        lines.append(f"ADR;TYPE=WORK:;;{safe_addr};;;;")
        
    # Online Profile Link
    if online_url:
        lines.append(f"URL;TYPE=WORK:{online_url}")
    elif card.portfolio_url:
        lines.append(f"URL;TYPE=WORK:{card.portfolio_url}")
        
    # Social profiles and custom labels
    if card.linkedin:
        lines.append(f"X-SOCIALPROFILE;TYPE=linkedin:{card.linkedin}")
    if card.github:
        lines.append(f"X-SOCIALPROFILE;TYPE=github:{card.github}")
    if card.instagram:
        lines.append(f"X-SOCIALPROFILE;TYPE=instagram:{card.instagram}")
        
    lines.append("END:VCARD")
    return "\r\n".join(lines)

def create_vcf_file(card, online_url=None):
    """
    Creates and saves a .vcf file for the card, updating the card's vcf_file field.
    """
    vcard_text = generate_vcard_content(card, online_url)
    
    filename = f"vcard_{card.slug}.vcf"
    
    # Create file content
    content = ContentFile(vcard_text.encode('utf-8'))
    
    # If the file already exists, we remove the old file to avoid duplicates
    if card.vcf_file:
        old_path = card.vcf_file.path
        if os.path.exists(old_path):
            os.remove(old_path)
            
    card.vcf_file.save(filename, content, save=False)
    return card.vcf_file
