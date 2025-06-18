from rest_framework import permissions

class IsHRUser(permissions.BasePermission):
    """
    Custom permission to only allow HR users (role 5) to access.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Check if user has user_role attribute and it equals 5
        return getattr(request.user, 'user_role', None) == 5

class IsHRUserForApplications(permissions.BasePermission):
    """
    Custom permission for job applications - only HR can view/manage.
    Anyone can create applications.
    """
    def has_permission(self, request, view):
        # Allow anyone to create applications (POST to create)
        if request.method == 'POST' and getattr(view, 'action', None) == 'create':
            return True
        
        # For all other actions, only HR users
        if not request.user or not request.user.is_authenticated:
            return False
            
        return getattr(request.user, 'user_role', None) == 5

