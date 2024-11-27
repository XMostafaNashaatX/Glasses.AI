# Generated by Django 5.1.3 on 2024-11-27 19:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='image',
        ),
        migrations.AddField(
            model_name='book',
            name='image_url_l',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='book',
            name='image_url_m',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='book',
            name='image_url_s',
            field=models.URLField(blank=True, null=True),
        ),
    ]
