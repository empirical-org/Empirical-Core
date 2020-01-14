# Generated by Django 2.2.5 on 2019-12-20 17:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('comprehension', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Passage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('text', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Prompt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('text', models.TextField()),
                ('max_attempts', models.PositiveIntegerField(default=5)),
                ('max_attempts_feedback', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ActivityPrompt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField()),
                ('activity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='comprehension.Activity')),
                ('prompt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='comprehension.Prompt')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='ActivityPassage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField()),
                ('activity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='comprehension.Activity')),
                ('passage', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='comprehension.Passage')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.AddField(
            model_name='activity',
            name='passages',
            field=models.ManyToManyField(through='comprehension.ActivityPassage', to='comprehension.Passage'),
        ),
        migrations.AddField(
            model_name='activity',
            name='prompts',
            field=models.ManyToManyField(through='comprehension.ActivityPrompt', to='comprehension.Prompt'),
        ),
    ]
