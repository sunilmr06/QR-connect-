from rest_framework import serializers
from .models import DigitalCard

class DigitalCardSerializer(serializers.ModelSerializer):
    # Dynamic fields for asset absolute URLs
    offline_qr_url = serializers.SerializerMethodField()
    online_qr_url = serializers.SerializerMethodField()
    hybrid_qr_url = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()
    png_url = serializers.SerializerMethodField()
    vcf_url = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = DigitalCard
        fields = [
            'id', 'name', 'phone', 'email', 'photo', 'photo_url',
            'designation', 'department', 'company', 'address',
            'linkedin', 'github', 'instagram', 'portfolio_url', 'resume_url',
            'theme', 'paid_tier', 'slug', 
            'offline_qr_url', 'online_qr_url', 'hybrid_qr_url',
            'pdf_url', 'png_url', 'vcf_url',
            'profile_views', 'qr_scans', 'downloads',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'slug', 'profile_views', 'qr_scans', 'downloads', 
            'created_at', 'updated_at', 'photo_url'
        ]

    def get_photo_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None

    def get_offline_qr_url(self, obj):
        if obj.offline_qr:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.offline_qr.url)
            return obj.offline_qr.url
        return None

    def get_online_qr_url(self, obj):
        if obj.online_qr:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.online_qr.url)
            return obj.online_qr.url
        return None

    def get_hybrid_qr_url(self, obj):
        if obj.hybrid_qr:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.hybrid_qr.url)
            return obj.hybrid_qr.url
        return None

    def get_pdf_url(self, obj):
        if obj.pdf_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.pdf_file.url)
            return obj.pdf_file.url
        return None

    def get_png_url(self, obj):
        if obj.png_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.png_file.url)
            return obj.png_file.url
        return None

    def get_vcf_url(self, obj):
        if obj.vcf_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.vcf_file.url)
            return obj.vcf_file.url
        return None
