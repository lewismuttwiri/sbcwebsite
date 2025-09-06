import json
import logging
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.channel_layer.group_add('receptionist_notifications', self.channel_name)

        logger.info(f"Customer connected to {self.room_group_name}")
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self.channel_layer.group_discard('receptionist_notifications', self.channel_name)
        logger.info(f"Customer disconnected from {self.room_group_name}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data.get('message', '')
            sender_type = data.get('sender_type', 'customer')
            sender_name = data.get('sender_name', 'Anonymous')
            
            logger.info(f"Data: {data}")
            logger.info(f"Message data: {data}")
            logger.info(f"Message from {sender_name} ({sender_type}): {message}")

            # Save to DB - use the room_id from the WebSocket URL
            logger.info(f"Saving message to room {self.room_name}")
            await self.save_message(self.room_name, sender_type, message, sender_name)

            # Send message to the room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender_type': sender_type,
                    'sender_name': sender_name,
                    'timestamp': datetime.now().isoformat(),
                    'room_id': self.room_name
                }
            )

        except json.JSONDecodeError:
            logger.error("Invalid JSON")
        except Exception as e:
            logger.error(f"Error: {e}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message'],
            'sender_type': event.get('sender_type', 'customer'),
            'sender_name': event.get('sender_name', 'Anonymous'),
            'timestamp': event.get('timestamp'),
            'room_id': event.get('room_id')
        }))

    @database_sync_to_async
    def save_message(self, room_id, sender_type, message, sender_name):
        try:
            room = ChatRoom.objects.get(id=room_id)
            logger.info(f"Saving message to DB: {message}")
            Message.objects.create(room=room, sender_type=sender_type, message=message, sender_name=sender_name)
        except ChatRoom.DoesNotExist:
            logger.error(f"ChatRoom with id {room_id} does not exist")
        except Exception as e:
            logger.error(f"Error saving message: {str(e)}")


class ReceptionistConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add('receptionist_notifications', self.channel_name)
        logger.info("Receptionist connected")
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('receptionist_notifications', self.channel_name)
        logger.info("Receptionist disconnected")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')

            if message_type == 'join_chat':
                room_id = data.get('room_id')
                if room_id:
                    await self.channel_layer.group_add(f'chat_{room_id}', self.channel_name)
                    logger.info(f"Receptionist joined room: {room_id}")
            
            elif message_type == 'chat_message':
                room_id = data.get('room_id')
                if room_id:
                    await self.channel_layer.group_send(
                        f'chat_{room_id}',
                        {
                            'type': 'chat_message',
                            'message': data.get('message', ''),
                            'sender_type': 'receptionist',
                            'sender_name': data.get('sender_name', 'Customer Service'),
                            'timestamp': datetime.now().isoformat(),
                            'room_id': room_id
                        }
                    )

        except json.JSONDecodeError:
            logger.error("Invalid JSON from receptionist")
        except Exception as e:
            logger.error(f"Error: {e}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))
