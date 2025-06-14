from rest_framework import serializers
from sbcapp.models import CustomUser

class AuthUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 
                  'password', 'confirm_password', 'user_role', 'is_verified')
        extra_kwargs = {
            'password': {'write_only': True},
            'is_verified': {'read_only': True}
        }
    
    def validate_email(self, value):
        """
        Check that the email is not already in use.
        """
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate(self, data):
        # Check that passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords don't match"})
        return data
    
    def create(self, validated_data):
        # Remove confirm_password from the data
        validated_data.pop('confirm_password', None)
        
        # Generate username from email if not provided
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email'].split('@')[0]
        
        # Use create_user to properly hash the password
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=validated_data.get('phone_number', ''),
            user_role=validated_data.get('user_role', 4),  # Default to customer
            is_verified=False  # New users start unverified
        )
        return user
    
    def update(self, instance, validated_data):
        # Handle password updates properly
        password = validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)  # Remove confirm_password
        
        user = super().update(instance, validated_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        return user
class GoogleAuthUserSerializer(serializers.ModelSerializer):
    """
    Serializer for Google OAuth user registration
    """
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'user_role', 'is_verified']
        
    def create(self, validated_data):
        """
        Create user without password for Google OAuth
        """
        # Set a random unusable password for Google users
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
        )
        
        # Set additional fields
        user.user_role = validated_data.get('user_role', 4)
        user.is_verified = validated_data.get('is_verified', True)
        
        # Set unusable password for Google users
        user.set_unusable_password()
        user.save()
        
        return user

