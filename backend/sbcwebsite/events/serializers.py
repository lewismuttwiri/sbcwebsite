from rest_framework import serializers
from .models import TeamEventImage, ActivityImage

class TeamEventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamEventImage
        fields = ['id', 'image', 'uploaded_date']

class TeamEventImageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamEventImage
        fields = ['image']

class ActivityImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityImage
        fields = ['id', 'image', 'uploaded_date']

class ActivityImageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityImage
        fields = ['image']

