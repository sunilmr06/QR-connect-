from django.db import models
from django.utils.text import slugify
import uuid
import os

class DigitalCard(models.Model):
    THEME_CHOICES = [
        ('professional_blue', 'Professional Blue'),
        ('executive_dark', 'Executive Dark'),
        ('modern_purple', 'Modern Purple'),
    ]

    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100, blank=True)
    company = models.CharField(max_length=100)
    address = models.TextField(blank=True)
    
    # Social Links
    linkedin = models.URLField(max_length=300, blank=True)
    github = models.URLField(max_length=300, blank=True)
    instagram = models.URLField(max_length=300, blank=True)
    portfolio_url = models.URLField(max_length=300, blank=True)
    resume_url = models.URLField(max_length=300, blank=True)
    
    # Theme Selection
    theme = models.CharField(max_length=50, choices=THEME_CHOICES, default='professional_blue')
    
    # Paid Tier Selection
    TIER_CHOICES = [
        ('silver', 'Silver (15 Rs)'),
        ('gold', 'Gold (20 Rs)'),
        ('platinum', 'Platinum (40 Rs)'),
    ]
    paid_tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='silver')
    
    # URL Slug
    slug = models.SlugField(max_length=150, unique=True, blank=True)
    
    # Asset files
    offline_qr = models.ImageField(upload_to='qrs/', blank=True, null=True)
    online_qr = models.ImageField(upload_to='qrs/', blank=True, null=True)
    hybrid_qr = models.ImageField(upload_to='qrs/', blank=True, null=True)
    pdf_file = models.FileField(upload_to='pdfs/', blank=True, null=True)
    png_file = models.ImageField(upload_to='pngs/', blank=True, null=True)
    vcf_file = models.FileField(upload_to='vcfs/', blank=True, null=True)
    
    # Analytics
    profile_views = models.IntegerField(default=0)
    qr_scans = models.IntegerField(default=0)
    downloads = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            # Generate a base slug from the user's name
            base_slug = slugify(self.name)
            if not base_slug:
                base_slug = "card"
            
            # Ensure slug is unique by checking DB and appending random hex suffix if duplicate found
            unique_slug = base_slug
            counter = 1
            while DigitalCard.objects.filter(slug=unique_slug).exists():
                suffix = uuid.uuid4().hex[:4]
                unique_slug = f"{base_slug}-{suffix}"
                counter += 1
                if counter > 10:  # Fail-safe to avoid infinite loop
                    break
            self.slug = unique_slug
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.company} ({self.designation})"


class AnalyticsLog(models.Model):
    EVENT_CHOICES = [
        ('view', 'Profile View'),
        ('scan', 'QR Scan'),
        ('download', 'Asset Download'),
    ]
    card = models.ForeignKey(DigitalCard, on_delete=models.CASCADE, related_name='analytics_logs')
    event_type = models.CharField(max_length=20, choices=EVENT_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.card.name} - {self.event_type} at {self.created_at}"

