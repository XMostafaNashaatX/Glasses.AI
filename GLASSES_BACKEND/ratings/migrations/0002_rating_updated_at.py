# Generated by Django 5.1.2 on 2024-11-29 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ratings", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="rating",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
    ]