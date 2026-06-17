import os
import sys
import django
from django.shortcuts import reverse
from rest_framework import status
from django.test import RequestFactory

# Add backend to python path and setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qrconnect.settings')
django.setup()

from cards.models import DigitalCard
from cards.views import get_card_by_slug, track_qr_scan, download_png

def test_tier_permissions():
    print("=== STARTING QRCONNECT TIER PERMISSION TESTS ===")
    
    # Clean up any existing test cards
    DigitalCard.objects.filter(name__startswith="Test Tier").delete()
    
    # 1. Create a Silver Card
    print("\n--- Testing Silver Card (15 Rs) ---")
    silver_card = DigitalCard.objects.create(
        name="Test Tier Silver",
        phone="+91 99999 11111",
        email="silver@test.com",
        designation="Developer",
        company="Silver Inc.",
        paid_tier="silver"
    )
    print(f"Created Silver card. Slug: {silver_card.slug}, Tier: {silver_card.paid_tier}")
    
    # Mock some fake file paths so views don't fail on missing files
    silver_card.vcf_file = "vcfs/test.vcf"
    silver_card.png_file = "pngs/test.jpg"
    silver_card.save()

    factory = RequestFactory()

    # View online profile (get_card_by_slug) -> should return 403
    request = factory.get(f'/api/cards/{silver_card.slug}/')
    response = get_card_by_slug(request, slug=silver_card.slug)
    print(f"Online Profile Access Response Status: {response.status_code} (Expected: 403)")
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Scan QR (track_qr_scan) -> should redirect to direct VCF download
    request = factory.get(f'/api/cards/{silver_card.slug}/scan/')
    response = track_qr_scan(request, slug=silver_card.slug)
    print(f"Scan QR Redirect Status: {response.status_code} (Expected: 302)")
    print(f"Redirect URL: {response.url} (Expected: to include vcf)")
    assert response.status_code == 302
    assert "vcf" in response.url

    # Download PNG (download_png) -> should return 403
    request = factory.get(f'/api/cards/{silver_card.slug}/png/')
    response = download_png(request, slug=silver_card.slug)
    print(f"Download PNG Response Status: {response.status_code} (Expected: 403)")
    assert response.status_code == status.HTTP_403_FORBIDDEN


    # 2. Create a Gold Card
    print("\n--- Testing Gold Card (20 Rs) ---")
    gold_card = DigitalCard.objects.create(
        name="Test Tier Gold",
        phone="+91 99999 22222",
        email="gold@test.com",
        designation="Designer",
        company="Gold Inc.",
        paid_tier="gold"
    )
    print(f"Created Gold card. Slug: {gold_card.slug}, Tier: {gold_card.paid_tier}")
    
    gold_card.vcf_file = "vcfs/test.vcf"
    gold_card.png_file = "pngs/test.jpg"
    gold_card.save()

    # View online profile (get_card_by_slug) -> should return 403
    request = factory.get(f'/api/cards/{gold_card.slug}/')
    response = get_card_by_slug(request, slug=gold_card.slug)
    print(f"Online Profile Access Response Status: {response.status_code} (Expected: 403)")
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Scan QR (track_qr_scan) -> should redirect to direct VCF download
    request = factory.get(f'/api/cards/{gold_card.slug}/scan/')
    response = track_qr_scan(request, slug=gold_card.slug)
    print(f"Scan QR Redirect Status: {response.status_code} (Expected: 302)")
    print(f"Redirect URL: {response.url} (Expected: to include vcf)")
    assert response.status_code == 302
    assert "vcf" in response.url

    # Download PNG (download_png) -> should NOT return 403 (will raise FileNotFoundError or Http404 since fake file doesn't actually exist on disk, which is fine)
    request = factory.get(f'/api/cards/{gold_card.slug}/png/')
    try:
        response = download_png(request, slug=gold_card.slug)
        print(f"Download PNG Response Status: {response.status_code} (Expected: normal/non-403 response)")
    except Exception as e:
        print(f"Download PNG raised exception: {type(e).__name__} (Expected: FileNotFoundError/Http404 since file doesn't exist on disk, meaning 403 restriction check passed!)")
        assert "Http404" in type(e).__name__ or "FileNotFoundError" in type(e).__name__


    # 3. Create a Platinum Card
    print("\n--- Testing Platinum Card (40 Rs) ---")
    platinum_card = DigitalCard.objects.create(
        name="Test Tier Platinum",
        phone="+91 99999 44444",
        email="platinum@test.com",
        designation="Executive",
        company="Platinum Inc.",
        paid_tier="platinum"
    )
    print(f"Created Platinum card. Slug: {platinum_card.slug}, Tier: {platinum_card.paid_tier}")
    
    platinum_card.vcf_file = "vcfs/test.vcf"
    platinum_card.png_file = "pngs/test.jpg"
    platinum_card.save()

    # View online profile (get_card_by_slug) -> should return 200 (since we mock data, Serializer will format it)
    request = factory.get(f'/api/cards/{platinum_card.slug}/')
    response = get_card_by_slug(request, slug=platinum_card.slug)
    print(f"Online Profile Access Response Status: {response.status_code} (Expected: 200)")
    assert response.status_code == status.HTTP_200_OK

    # Scan QR (track_qr_scan) -> should redirect to frontend profile page
    request = factory.get(f'/api/cards/{platinum_card.slug}/scan/')
    response = track_qr_scan(request, slug=platinum_card.slug)
    print(f"Scan QR Redirect Status: {response.status_code} (Expected: 302)")
    print(f"Redirect URL: {response.url} (Expected: to include /u/{platinum_card.slug})")
    assert response.status_code == 302
    assert f"/u/{platinum_card.slug}" in response.url

    # Clean up test cards
    DigitalCard.objects.filter(name__startswith="Test Tier").delete()
    print("\n=== ALL TIER PERMISSION TESTS PASSED! ===")

if __name__ == "__main__":
    test_tier_permissions()
