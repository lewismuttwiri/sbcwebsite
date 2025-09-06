import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sbcwebsite.settings')
django.setup()

from django.db import connection

def check_database():
    try:
        with connection.cursor() as cursor:
            # Check if chat tables exist
            cursor.execute("SHOW TABLES LIKE 'chat_%'")
            chat_tables = cursor.fetchall()
            print("Chat tables in database:", chat_tables)
            
            # Check if migrations table exists
            cursor.execute("SHOW TABLES LIKE 'django_migrations'")
            migrations_table = cursor.fetchone()
            print("Migrations table exists:", bool(migrations_table))
            
            # Check applied migrations
            if migrations_table:
                cursor.execute("SELECT app, name FROM django_migrations WHERE app = 'chat'")
                applied_migrations = cursor.fetchall()
                print("Applied migrations for chat app:", applied_migrations)
            
    except Exception as e:
        print(f"Error checking database: {e}")

if __name__ == "__main__":
    check_database()
