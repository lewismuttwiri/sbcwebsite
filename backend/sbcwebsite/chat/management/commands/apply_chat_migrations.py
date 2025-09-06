from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Applies chat app migrations directly to the database'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Create chat_chatroom table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS `chat_chatroom` (
                    `id` char(32) NOT NULL,
                    `customer_name` varchar(100) NOT NULL,
                    `customer_email` varchar(100) NOT NULL,
                    `enquiry` varchar(100) NOT NULL,
                    `created_at` datetime(6) NOT NULL,
                    `is_active` tinyint(1) NOT NULL,
                    `receptionist_id` int NOT NULL,
                    PRIMARY KEY (`id`),
                    KEY `chat_chatroom_receptionist_id_3d5e4c72_fk_auth_user_id` (`receptionist_id`),
                    CONSTRAINT `chat_chatroom_receptionist_id_3d5e4c72_fk_auth_user_id` 
                        FOREIGN KEY (`receptionist_id`) REFERENCES `auth_user` (`id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''')
            
            # Create chat_message table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS `chat_message` (
                    `id` bigint NOT NULL AUTO_INCREMENT,
                    `sender_type` varchar(20) NOT NULL,
                    `sender_name` varchar(100) NOT NULL,
                    `content` longtext NOT NULL,
                    `timestamp` datetime(6) NOT NULL,
                    `room_id` char(32) NOT NULL,
                    PRIMARY KEY (`id`),
                    KEY `chat_message_room_id_2e5f5c1a_fk_chat_chatroom_id` (`room_id`),
                    CONSTRAINT `chat_message_room_id_2e5f5c1a_fk_chat_chatroom_id` 
                        FOREIGN KEY (`room_id`) REFERENCES `chat_chatroom` (`id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''')
            
            # Record the migration in django_migrations
            cursor.execute('''
                INSERT IGNORE INTO django_migrations (app, name, applied) 
                VALUES ('chat', '0001_initial', NOW())
            ''')
            
            self.stdout.write(self.style.SUCCESS('Successfully created chat tables'))
