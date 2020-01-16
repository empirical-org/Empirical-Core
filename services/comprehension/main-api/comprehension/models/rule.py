from django.db import models

from . import RuleSet
import re

class Rule(models.Model):
    regex_text = models.TextField(null=False)
    rule_set = models.ForeignKey(RuleSet, on_delete=models.CASCADE, related_name='rules')

    def __str__(self):
        return "%s: %s" % (self.rule_set, self.regex_text)

    def match(self, entry):
        return not re.search(self.regex_text, entry)