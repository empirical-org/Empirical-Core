# Generated by Django 2.2.5 on 2020-02-24 19:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comprehension', '0010_auto_20200219_2104'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbackhistory',
            name='feedback_optimal',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='feedbackhistory',
            name='feedback_text',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='feedbackhistory',
            name='feedback_type',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
