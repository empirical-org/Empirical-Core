# Generated by Django 3.0.3 on 2020-02-07 21:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comprehension', '0007_highlight'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ruleset',
            name='test_for_contains',
        ),
        migrations.AddField(
            model_name='ruleset',
            name='match',
            field=models.TextField(choices=[('all', 'all'), ('any', 'any')], default='all'),
        ),
    ]
