from rest_framework import serializers
from .models import PartnerApplication

class PartnerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerApplication
        fields = [
            'id', 'first_name', 'last_name', 'phone_number', 'email', 'company_name',
            'id_front', 'id_back', 'business_license',
            'tax_certificate', 'distribution_area',
            'submitted_at'
        ]
        read_only_fields = ['id', 'submitted_at']
        ref_name = "DistributorApplicationSerializer"

class PartnerApplicationAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerApplication
        fields = '__all__'
        read_only_fields = ['id', 'submitted_at', 'updated_at']
        ref_name = "DistributorApplicationAdminSerializer"
