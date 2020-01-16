from django.db import models

from . import DjangoChoices, Prompt


class RuleSet(models.Model):
    class PASS_ORDER(DjangoChoices):
        FIRST = 'first'
        SECOND = 'second'

    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE, related_name='rule_sets')
    name = models.TextField(null=False)
    feedback = models.TextField(null=False)
    priority = models.IntegerField(null=False, default=1)
    pass_order = models.TextField(null=False, choices=PASS_ORDER.get_for_choices())

    class Meta:
        unique_together = ('prompt', 'priority','pass_order',)

    def __str__(self):
        return self.name
