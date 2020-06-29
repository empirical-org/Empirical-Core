# Generated by Django 2.2.5 on 2020-05-20 19:33

from django.db import migrations, models

def transfer_prompt_rule_sets_many_to_many(apps, schema_editor):
    Prompt = apps.get_model('comprehension', 'Prompt')
    RuleSet = apps.get_model('comprehension', 'RuleSet')

    rule_sets = RuleSet.objects.all()
    for rule_set in rule_sets:
        prompt = rule_set.prompt
        if prompt:
            print(f'adding RuleSet {rule_set.id} to Prompt {prompt.id}')
            prompt.rule_sets.add(rule_set)
            prompt.save()


class Migration(migrations.Migration):

    dependencies = [
        ('comprehension', '0015_add_rule_sets_to_prompts'),
    ]

    operations = [
        migrations.RunPython(transfer_prompt_rule_sets_many_to_many),
    ]



