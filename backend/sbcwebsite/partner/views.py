from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import PartnerApplication
from .serializers import PartnerApplicationSerializer, PartnerApplicationAdminSerializer
from utils.helpers import Helper

class PartnerApplicationCreateView(generics.CreateAPIView):
    """
    Create a new distributor partnership application.
    """
    serializer_class = PartnerApplicationSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        operation_description="Submit a new distributor partnership application",
        responses={
            201: openapi.Response(
                description="Application submitted successfully",
                schema=PartnerApplicationSerializer()
            ),
            400: "Bad request"
        }
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the application
        application = serializer.save()

        # Send email notifications
        helper = Helper()
        admin_email_sent = False
        user_email_sent = False

        try:
            # Prepare application data for email using your actual model fields
            application_data = {
                'id': application.id,
                'first_name': application.first_name,
                'last_name': application.last_name,
                'full_name': application.full_name,
                'contact_person': application.full_name,
                'email': application.email,
                'phone': application.phone_number,
                'phone_number': application.phone_number,
                'company_name': application.company_name or 'Not specified',
                'distribution_area': application.distribution_area,
                'location': application.distribution_area,
                'status': application.get_status_display(),
                'submitted_at': application.submitted_at,
                'created_at': application.submitted_at,
                'updated_at': application.updated_at,
                'admin_notes': application.admin_notes,
                'business_type': 'Distribution Partner',
                'experience_years': 'To be discussed',
                'target_market': 'To be discussed',
                'distribution_channels': 'To be discussed',
                'warehouse_capacity': 'To be discussed',
                'delivery_fleet': 'To be discussed',
                'coverage_area': application.distribution_area,
                'annual_revenue': 'To be discussed',
                'current_brands': 'To be discussed',
                'marketing_strategy': 'To be discussed during interview',
                'additional_info': 'Application submitted with required documents',

                # ✅ Add model instance for accessing file paths
                'instance': application,
            }

            # Send email to admin (with attachments)
            admin_email_result = helper.send_distributor_request_email_to_admin(application_data)
            admin_email_sent = (admin_email_result == 1)

            # Send confirmation email to applicant
            user_email_result = helper.send_become_distributor_email(application_data)
            user_email_sent = (user_email_result == 1)

        except Exception as e:
            print(f"Error sending emails: {str(e)}")
            import traceback
            traceback.print_exc()

        # Prepare response
        headers = self.get_success_headers(serializer.data)
        response_data = {
            "message": "Partnership application submitted successfully",
            "data": serializer.data
        }

        # Add email status to response
        if admin_email_sent and user_email_sent:
            response_data["email_status"] = "All email notifications sent successfully"
        elif admin_email_sent or user_email_sent:
            response_data["email_status"] = "Some email notifications sent"
            response_data["warning"] = "Not all email notifications could be sent"
        else:
            response_data["email_status"] = "Email notifications failed"
            response_data["warning"] = "Email notifications could not be sent"

        return Response(
            response_data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class PartnerApplicationAdminViewSet(viewsets.ModelViewSet):
    """
    Admin endpoints for managing distributor partnership applications.
    """
    queryset = PartnerApplication.objects.all()
    serializer_class = PartnerApplicationAdminSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    
    @swagger_auto_schema(
        operation_description="Update application status",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'status': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=['pending', 'reviewing', 'approved', 'rejected']
                ),
                'admin_notes': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )
    )
    def partial_update(self, request, *args, **kwargs):
        # Get the current application
        application = self.get_object()
        old_status = application.status
        
        # Perform the update
        response = super().partial_update(request, *args, **kwargs)
        
        # Check if status was updated
        application.refresh_from_db()
        new_status = application.status
        
        if old_status != new_status:
            # Send status update email
            helper = Helper()
            try:
                application_data = {
                    'id': application.id,
                    'company_name': application.company_name or 'Not specified',
                    'contact_person': application.full_name,
                    'first_name': application.first_name,
                    'last_name': application.last_name,
                    'email': application.email,
                    'admin_notes': application.admin_notes,
                    'updated_at': application.updated_at,
                }
                
                email_result = helper.send_distributor_status_update_email(
                    application_data, old_status, new_status
                )
                
                if email_result == 1:
                    response.data['email_notification'] = 'Status update email sent successfully'
                else:
                    response.data['email_notification'] = 'Status update email failed to send'
                    
            except Exception as e:
                print(f"Error sending status update email: {str(e)}")
                response.data['email_notification'] = f'Email error: {str(e)}'
        
        return response
