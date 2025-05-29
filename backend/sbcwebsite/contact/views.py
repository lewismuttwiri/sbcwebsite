from rest_framework import generics, status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Comment, DistributorContact
from .serializers import CommentSerializer, DistributorContactSerializer
from utils.helpers import Helper

class CommentCreateAPIView(generics.CreateAPIView):
    """
    API endpoint that allows comments to be created.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    @swagger_auto_schema(
        operation_description="Create a new comment",
        request_body=CommentSerializer,
        responses={
            201: openapi.Response(
                description="Comment created successfully",
                schema=CommentSerializer
            ),
            400: "Bad Request",
            500: "Internal Server Error - Email sending failed"
        }
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save the comment first
        self.perform_create(serializer)
        
        # Send email notification using Helper
        helper = Helper()
        try:
            # Extract data from the serializer
            comment_data = serializer.validated_data
            first_name = comment_data.get('first_name', '')
            last_name = comment_data.get('last_name', '')
            full_name = f"{first_name} {last_name}".strip()
            email = comment_data.get('email', '')
            subject = comment_data.get('subject', 'Contact Form Submission')
            message = comment_data.get('message', '')
            
            
            # Send email to info@sbckenya.com
            email_result = helper.send_contact_form_email(
                name=full_name,
                email=email,
                phone=None,  # No phone field in your model
                subject_text=subject,
                message_text=message,
                
                
            )
            
            headers = self.get_success_headers(serializer.data)
            
            if email_result == 1:
                return Response(
                    {
                        "message": "Comment submitted successfully and email notification sent",
                        "data": serializer.data
                    },
                    status=status.HTTP_201_CREATED,
                    headers=headers
                )
            else:
                # Comment saved but email failed
                return Response(
                    {
                        "message": "Comment submitted successfully but email notification failed",
                        "data": serializer.data,
                        "warning": "Email notification could not be sent"
                    },
                    status=status.HTTP_201_CREATED,
                    headers=headers
                )
                
        except Exception as e:
            # Comment saved but email processing failed
            headers = self.get_success_headers(serializer.data)
            return Response(
                {
                    "message": "Comment submitted successfully but email notification failed",
                    "data": serializer.data,
                    "error": f"Email error: {str(e)}"
                },
                status=status.HTTP_201_CREATED,
                headers=headers
            )

class CommentListAPIView(generics.ListAPIView):
    """
    API endpoint that allows comments to be viewed.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    @swagger_auto_schema(
        operation_description="List all comments",
        responses={
            200: openapi.Response(
                description="List of comments",
                schema=CommentSerializer(many=True)
            )
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class DistributorContactCreateAPIView(generics.CreateAPIView):
    """
    API endpoint that allows distributor contacts to be created.
    """
    queryset = DistributorContact.objects.all()
    serializer_class = DistributorContactSerializer
    
    @swagger_auto_schema(
        operation_description="Create a new distributor contact request",
        request_body=DistributorContactSerializer,
        responses={
            201: openapi.Response(
                description="Distributor contact created successfully",
                schema=DistributorContactSerializer
            ),
            400: "Bad Request",
            500: "Internal Server Error - Email sending failed"
        }
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save the distributor contact first
        self.perform_create(serializer)
        
        # Send email notification using Helper
        helper = Helper()
        try:
            # Extract data from the serializer
            contact_data = serializer.validated_data
            first_name = contact_data.get('first_name', '')
            last_name = contact_data.get('last_name', '')
            full_name = f"{first_name} {last_name}".strip()
            email = contact_data.get('email', '')
            phone = contact_data.get('phone', '')
            business_name = contact_data.get('business_name', '')
            business_type = contact_data.get('business_type', '')
            county = contact_data.get('county', '')
            sub_county = contact_data.get('sub_county', '')
            town = contact_data.get('town', '')
            message = contact_data.get('message', '')
            
            # Create email subject and message
            subject = f"Distributor Contact Request - {business_name}"
            email_message = f"""
New Distributor Contact Request:

Business Information:
- Business Name: {business_name}
- Business Type: {business_type}
- Location: {town}, {sub_county}, {county}

Contact Information:
- Name: {full_name}
- Email: {email}
- Phone: {phone}

Message:
{message if message else 'No additional message provided.'}

Please contact this distributor to provide information about the nearest depot.
            """.strip()
            
            # Send email to info@sbckenya.com
            email_result = helper.send_distibutor_contact_form_email(
                name=full_name,
                email=email,
                phone=phone,
                subject_text=subject,
                message_text=email_message
            )
            
            headers = self.get_success_headers(serializer.data)
            
            if email_result == 1:
                return Response(
                    {
                        "message": "Distributor contact request submitted successfully and email notification sent",
                        "data": serializer.data
                    },
                    status=status.HTTP_201_CREATED,
                    headers=headers
                )
            else:
                # Contact saved but email failed
                return Response(
                    {
                        "message": "Distributor contact request submitted successfully but email notification failed",
                        "data": serializer.data,
                        "warning": "Email notification could not be sent"
                    },
                    status=status.HTTP_201_CREATED,
                    headers=headers
                )
                
        except Exception as e:
            # Contact saved but email processing failed
            headers = self.get_success_headers(serializer.data)
            return Response(
                {
                    "message": "Distributor contact request submitted successfully but email notification failed",
                    "data": serializer.data,
                    "error": f"Email error: {str(e)}"
                },
                status=status.HTTP_201_CREATED,
                headers=headers
            )


class DistributorContactListAPIView(generics.ListAPIView):
    """
    API endpoint that allows distributor contacts to be viewed.
    """
    queryset = DistributorContact.objects.all()
    serializer_class = DistributorContactSerializer
    
    @swagger_auto_schema(
        operation_description="List all distributor contacts",
        responses={
            200: openapi.Response(
                description="List of distributor contacts",
                schema=DistributorContactSerializer(many=True)
            )
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class DistributorContactDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that allows a specific distributor contact to be viewed, updated or deleted.
    """
    queryset = DistributorContact.objects.all()
    serializer_class = DistributorContactSerializer
    
    @swagger_auto_schema(
        operation_description="Retrieve a specific distributor contact",
        responses={
            200: openapi.Response(
                description="Distributor contact details",
                schema=DistributorContactSerializer
            ),
            404: "Not Found"
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Update a specific distributor contact",
        request_body=DistributorContactSerializer,
        responses={
            200: openapi.Response(
                description="Distributor contact updated successfully",
                schema=DistributorContactSerializer
            ),
            400: "Bad Request",
            404: "Not Found"
        }
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Partially update a specific distributor contact",
        request_body=DistributorContactSerializer,
        responses={
            200: openapi.Response(
                description="Distributor contact updated successfully",
                schema=DistributorContactSerializer
            ),
            400: "Bad Request",
            404: "Not Found"
        }
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Delete a specific distributor contact",
        responses={
            204: "No Content - Distributor contact deleted successfully",
            404: "Not Found"
        }
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
