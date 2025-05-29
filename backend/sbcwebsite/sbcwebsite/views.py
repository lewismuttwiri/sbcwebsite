from django.http import JsonResponse

def test_cors(request):
    """A simple view to test CORS headers"""
    # Print request information for debugging
    print(f"DEBUG TEST VIEW: Request from origin: {request.headers.get('Origin')}")
    print(f"DEBUG TEST VIEW: Request method: {request.method}")
    
    # Create a simple response
    response = JsonResponse({"message": "CORS test successful"})
    
    # Get the origin from the request
    origin = request.headers.get('Origin')
    
    # If there's an origin, set CORS headers
    if origin:
        response["Access-Control-Allow-Origin"] = origin
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        
        # Print the headers we're setting
        print(f"DEBUG TEST VIEW: Setting CORS headers for origin: {origin}")
        print(f"DEBUG TEST VIEW: Response headers: {dict(response.headers)}")
    
    return response
