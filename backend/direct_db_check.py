import os
import django
import pymysql
from django.conf import settings

def check_database():
    try:
        # Get database settings
        db_settings = settings.DATABASES['default']
        
        # Connect to the database
        connection = pymysql.connect(
            host=db_settings['HOST'],
            user=db_settings['USER'],
            password=db_settings['PASSWORD'],
            database=db_settings['NAME'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
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
                
        finally:
            connection.close()
            
    except Exception as e:
        print(f"Error checking database: {e}")

if __name__ == "__main__":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sbcwebsite.settings')
    django.setup()
    check_database()
