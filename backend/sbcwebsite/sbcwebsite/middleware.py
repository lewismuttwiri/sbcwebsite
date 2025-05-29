class CustomCORSMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Process the request first
        response = self.get_response(request)
        
        # Get the origin from the request headers
        origin = request.headers.get('Origin')
        
        # Print debugging information
        print(f"DEBUG: Request from origin: {origin}")
        print(f"DEBUG: Request path: {request.path}")
        
        # If there's an origin header, set the CORS headers
        if origin:
            # Set the specific origin instead of wildcard
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Credentials"] = "true"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Accept, Content-Type, Authorization, X-Requested-With"
            
            # Print the headers we're setting
            print(f"DEBUG: Setting CORS headers for origin: {origin}")
        
        return response
