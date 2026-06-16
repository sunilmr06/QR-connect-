from django.urls import path
from . import views

urlpatterns = [
    path('create', views.create_card, name='create_card'),
    path('analytics/dashboard', views.get_dashboard_analytics, name='dashboard_analytics'),
    path('<slug:slug>', views.get_card_by_slug, name='get_card'),
    path('<slug:slug>/pdf', views.download_pdf, name='download_pdf'),
    path('<slug:slug>/png', views.download_png, name='download_png'),
    path('<slug:slug>/vcf', views.download_vcf, name='download_vcf'),
    path('<slug:slug>/qr', views.download_qr, name='download_qr'),
    path('<slug:slug>/analytics', views.track_qr_scan, name='track_qr_scan'),
    path('<slug:slug>/delete', views.delete_card, name='delete_card'),
]
