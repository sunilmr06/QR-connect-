import os
import datetime
from django.shortcuts import redirect, get_object_or_404
from django.http import FileResponse, HttpResponse, Http404
from django.utils import timezone
from django.db.models import Sum, Count
from django.conf import settings

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import DigitalCard, AnalyticsLog
from .serializers import DigitalCardSerializer
from .services import vcf_service, qr_service, png_service, pdf_service

# Define frontend base URL for redirection and link generation
FRONTEND_BASE_URL = getattr(settings, 'FRONTEND_BASE_URL', 'http://localhost:5173')


@api_view(['POST'])
def create_card(request):
    """
    Creates a new DigitalCard and generates all asset files (VCF, QR codes, PNG, PDF).
    """
    serializer = DigitalCardSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        card = serializer.save()
        
        # Define public online profile URL
        profile_url = f"{FRONTEND_BASE_URL}/u/{card.slug}"
        
        try:
            # 1. Generate VCF contact file
            vcf_service.create_vcf_file(card, profile_url)
            
            # 2. Generate all QR Codes (Offline, Online, Hybrid)
            # The Hybrid QR will contain the VCard details plus the online profile URL
            qr_service.generate_all_qrs(card, profile_url)
            
            # 3. Generate 1080x1080 social media PNG card
            png_service.generate_social_card_png(card)
            
            # 4. Generate printable PDF (business card and A4 layout)
            pdf_service.generate_card_pdf(card)
            
            # Save again with file fields populated
            card.save()
            
            # Refresh serialized data
            refresh_serializer = DigitalCardSerializer(card, context={'request': request})
            return Response(refresh_serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            # Clean up card if generation fails
            card.delete()
            return Response(
                {"error": f"Failed to generate assets: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_card_by_slug(request, slug):
    """
    Retrieves a card by slug and records a profile view.
    """
    card = get_object_or_404(DigitalCard, slug=slug)
    
    # Increment view counter
    card.profile_views += 1
    card.save()
    
    # Log view event
    AnalyticsLog.objects.create(card=card, event_type='view')
    
    serializer = DigitalCardSerializer(card, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def download_pdf(request, slug):
    """
    Serves the printable PDF and records a download event.
    """
    card = get_object_or_404(DigitalCard, slug=slug)
    if not card.pdf_file:
        raise Http404("PDF file not found")
        
    card.downloads += 1
    card.save()
    AnalyticsLog.objects.create(card=card, event_type='download')
    
    response = FileResponse(card.pdf_file.open('rb'), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="qrconnect_{card.slug}.pdf"'
    return response


@api_view(['GET'])
def download_png(request, slug):
    """
    Serves the social media PNG card and records a download event.
    """
    card = get_object_or_404(DigitalCard, slug=slug)
    if not card.png_file:
        raise Http404("PNG file not found")
        
    card.downloads += 1
    card.save()
    AnalyticsLog.objects.create(card=card, event_type='download')
    
    # Serve card image as an attachment so it downloads directly
    response = FileResponse(card.png_file.open('rb'), content_type='image/jpeg')
    response['Content-Disposition'] = f'attachment; filename="qrconnect_{card.slug}.jpg"'
    return response


@api_view(['GET'])
def download_vcf(request, slug):
    """
    Serves the VCF contact card and records a download event.
    """
    card = get_object_or_404(DigitalCard, slug=slug)
    if not card.vcf_file:
        raise Http404("VCF file not found")
        
    card.downloads += 1
    card.save()
    AnalyticsLog.objects.create(card=card, event_type='download')
    
    response = FileResponse(card.vcf_file.open('rb'), content_type='text/vcard')
    response['Content-Disposition'] = f'attachment; filename="{card.slug}.vcf"'
    return response


@api_view(['GET'])
def download_qr(request, slug):
    """
    Serves the Hybrid QR code image file and records a download event.
    """
    card = get_object_or_404(DigitalCard, slug=slug)
    if not card.hybrid_qr:
        raise Http404("QR code not found")
        
    card.downloads += 1
    card.save()
    AnalyticsLog.objects.create(card=card, event_type='download')
    
    response = FileResponse(card.hybrid_qr.open('rb'), content_type='image/png')
    response['Content-Disposition'] = f'attachment; filename="qr_{card.slug}.png"'
    return response


@api_view(['GET'])
def track_qr_scan(request, slug):
    """
    Increments scan analytics, logs scan event, and redirects to public profile.
    This enables dynamic scan tracking when someone scans the QR code.
    """
    card = get_object_or_404(DigitalCard, slug=slug)
    
    card.qr_scans += 1
    card.save()
    AnalyticsLog.objects.create(card=card, event_type='scan')
    
    # Redirect directly to online profile page
    return redirect(f"{FRONTEND_BASE_URL}/u/{card.slug}")


@api_view(['GET'])
def get_dashboard_analytics(request):
    """
    Aggregates database-wide statistics for the Admin Dashboard.
    """
    total_cards = DigitalCard.objects.count()
    
    stats = DigitalCard.objects.aggregate(
        total_views=Sum('profile_views'),
        total_scans=Sum('qr_scans'),
        total_downloads=Sum('downloads')
    )
    
    total_views = stats['total_views'] or 0
    total_scans = stats['total_scans'] or 0
    total_downloads = stats['total_downloads'] or 0
    
    # Calculate daily registration details for the last 7 days
    today = timezone.now().date()
    daily_registrations = []
    daily_scans = []
    
    for i in range(6, -1, -1):
        target_date = today - datetime.timedelta(days=i)
        date_str = target_date.strftime("%b %d")
        
        # Registration count
        reg_count = DigitalCard.objects.filter(created_at__date=target_date).count()
        daily_registrations.append({"date": date_str, "count": reg_count})
        
        # Scan count from logs
        scan_count = AnalyticsLog.objects.filter(
            event_type='scan',
            created_at__date=target_date
        ).count()
        daily_scans.append({"date": date_str, "count": scan_count})
        
    # Top 5 profiles by views
    top_cards = DigitalCard.objects.order_by('-profile_views')[:5]
    top_profiles = [{
        "name": card.name,
        "company": card.company,
        "designation": card.designation,
        "slug": card.slug,
        "views": card.profile_views,
        "scans": card.qr_scans
    } for card in top_cards]
    
    # Package response
    data = {
        "total_users": total_cards,  # Each card represents a user digital identity
        "total_cards": total_cards,
        "total_views": total_views,
        "total_scans": total_scans,
        "total_downloads": total_downloads,
        "daily_registrations": daily_registrations,
        "daily_scans": daily_scans,
        "top_profiles": top_profiles
    }
    
    return Response(data)


@api_view(['DELETE'])
def delete_card(request, slug):
    """
    Deletes a digital card by slug and cleans up its associated files in the filesystem.
    """
    card = get_object_or_404(DigitalCard, slug=slug)
    
    # Clean up associated files
    fields_to_clean = [
        card.photo, 
        card.offline_qr, 
        card.online_qr, 
        card.hybrid_qr, 
        card.pdf_file, 
        card.png_file, 
        card.vcf_file
    ]
    for field in fields_to_clean:
        if field and field.name:
            try:
                if os.path.exists(field.path):
                    os.remove(field.path)
            except Exception as e:
                # Log error
                pass
                
    card.delete()
    return Response({"message": "Successfully deleted card and all associated files."}, status=status.HTTP_200_OK)
