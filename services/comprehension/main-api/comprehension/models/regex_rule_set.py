from django.db import models

from . import DjangoChoices
import re


class RegexRuleSet(models.Model):
    class PASS_ORDER(DjangoChoices):
        FIRST = 'first'
        SECOND = 'second'

    prompt_id = models.ForeignKey(Prompt, on_delete=models.CASCADE)
    name = models.TextField(null=False)
    feedback = models.TextField(null=False)
    priority = models.IntegerField(null=False, default=1)
    pass_order = models.TextField(null=False, choices=PASS_ORDER.get_for_choices())

    class Meta:
        unique_together = ('prompt_id', 'priority','pass_order',)

    def __str__(self):
        return self.name



class Rule(models.Model):
    regex_text = models.TextField(null=False)
    regex_rule_set = models.ForeignKey(RegexRuleSet, on_delete=models.CASCADE)

    def __str__(self):
        return "%s: %s" % (self.regex_rule_set, self.regex_text)

    def match(self, entry):
        return not re.search(self.regex_text, entry)





