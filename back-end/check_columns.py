import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finance.settings')
django.setup()
from django.db import connection
cursor = connection.cursor()
cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'expense_management_expense'")
columns = cursor.fetchall()
print('Columns:', [col[0] for col in columns])