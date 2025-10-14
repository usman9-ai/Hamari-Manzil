# Generated manually to fix media field type from JSON to VARCHAR

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hostels', '0002_initial'),
    ]

    operations = [
        # Change media column type from JSON to VARCHAR in hostels_hostel table
        migrations.RunSQL(
            sql="ALTER TABLE hostels_hostel ALTER COLUMN media TYPE VARCHAR(255) USING media::text;",
            reverse_sql="ALTER TABLE hostels_hostel ALTER COLUMN media TYPE JSON USING media::json;"
        ),
        # Change media column type from JSON to VARCHAR in hostels_room table
        migrations.RunSQL(
            sql="ALTER TABLE hostels_room ALTER COLUMN media TYPE VARCHAR(255) USING media::text;",
            reverse_sql="ALTER TABLE hostels_room ALTER COLUMN media TYPE JSON USING media::json;"
        ),
    ]

