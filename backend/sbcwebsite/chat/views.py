# chat/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import ChatRoom, Message
import json
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
User = get_user_model()
from utils.helpers import Helper

@csrf_exempt
@require_http_methods(["POST"])
def create_chat_room(request):
    try:
        print("Raw request body:", request.body)
        data = json.loads(request.body)
        print("Parsed data:", data)
        
        customer_name = data.get('customer_name')
        customer_email = data.get('customer_email')
        enquiry = data.get('enquiry', 'No enquiry provided')
        
        if not customer_name or not customer_email:
            return JsonResponse({'error': 'Customer name and email are required'}, status=400)
            
        print("Looking for receptionist...")
        receptionist = User.objects.filter(user_role=7).order_by('?').first()
        print("Found receptionist:", receptionist)

        if not receptionist:
            return JsonResponse({'error': 'No receptionist available'}, status=404)

    

    except json.JSONDecodeError as e:
        print("JSON decode error:", e)
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        import traceback
        print("Unexpected error:", str(e))
        print("Traceback:", traceback.format_exc())
        return JsonResponse({'error': 'An unexpected error occurred'}, status=500)

    
    try:
        print("Creating chat room...")
        room = ChatRoom.objects.create(
            customer_name=customer_name,
            customer_email=customer_email,
            enquiry=enquiry,
            receptionist=receptionist
        )
        print("Chat room created successfully:", room.id)

        # Create an instance of Helper and call the method
        helper = Helper()
        helper.send_chat_notification_email(room)
        
        return JsonResponse({
            'room_id': str(room.id),
            'customer_name': room.customer_name,
            'enquiry': room.enquiry,
            'receptionist': room.receptionist.username
        })
       
    except Exception as e:
        import traceback
        print("Error creating chat room:", str(e))
        print("Traceback:", traceback.format_exc())
        return JsonResponse({'error': f'Failed to create chat room: {str(e)}'}, status=500)


@require_http_methods(["GET"])
def get_chat_messages(request, room_id):
    try:
        print("Fetching chat messages...", room_id)
        rooms = ChatRoom.objects.all()
        print("Rooms:", rooms)
        rooms = rooms.filter(id=room_id)
        print("Rooms:", rooms)
        rooms_data = [{
            'id': room.id,
            'customer_name': room.customer_name,
            'enquiry': room.enquiry,
            'receptionist': room.receptionist.username,
            'customer_email': room.customer_email,
            'created_at': room.created_at.isoformat(),
            'is_active': room.is_active
        } for room in rooms]

        print("Messages data:", rooms_data)
        
        return JsonResponse({'messages': rooms_data})
    except ChatRoom.DoesNotExist:
        return JsonResponse({'error': 'Chat room not found'}, status=404)


@require_http_methods(["GET"])
def get_chat_rooms(request):
    try:
        rooms = ChatRoom.objects.all()
        rooms_data = [{
            'id': room.id,
            'customer_name': room.customer_name,
            'enquiry': room.enquiry,
            'receptionist': room.receptionist.username,
            'customer_email': room.customer_email,
            'created_at': room.created_at.isoformat(),
            'is_active': room.is_active
        } for room in rooms]
        return JsonResponse({'rooms': rooms_data})
    except Exception as e:
        import traceback
        print("Error getting chat rooms:", str(e))
        print("Traceback:", traceback.format_exc())
        return JsonResponse({'error': f'Failed to get chat rooms: {str(e)}'}, status=500)

@require_http_methods(["GET"])
def get_chatroom_messages(request, room_id):
    try:
        print("Fetching chat messages for room:", room_id)
        messages = Message.objects.filter(room_id=room_id).select_related('room')
        print(f"Found {messages.count()} messages for room {room_id}")
        
        messages_data = [{
            'id': str(msg.id),
            'sender_type': msg.sender_type,
            'sender_name': msg.sender_name,
            'message': msg.message,
            'timestamp': msg.timestamp.isoformat(),
            'room_id': str(msg.room_id)
        } for msg in messages]

        print("Messages data:", messages_data)
        return JsonResponse({'messages': messages_data}, safe=False)
        
    except Exception as e:
        import traceback
        print("Error getting chat messages:", str(e))
        print("Traceback:", traceback.format_exc())
        return JsonResponse({'error': f'Failed to get chat messages: {str(e)}'}, status=500)
      
@csrf_exempt
@require_http_methods(["POST"])
def close_chatroom(request, room_id):
    try:
        room = ChatRoom.objects.get(id=room_id)
        room.is_active = False
        room.save()
        return JsonResponse({'success': True})
    except ChatRoom.DoesNotExist:
        return JsonResponse({'error': 'Chat room not found'}, status=404)
    except Exception as e:
        import traceback
        print("Error updating chat room status:", str(e))
        print("Traceback:", traceback.format_exc())
        return JsonResponse({'error': f'Failed to update chat room status: {str(e)}'}, status=500)


