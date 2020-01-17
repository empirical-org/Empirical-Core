from django.db import models

from . import RuleSet, BaseModel
import re

class Rule(BaseModel):
    regex_text = models.TextField(null=False)
    rule_set = models.ForeignKey(RuleSet, on_delete=models.CASCADE, related_name='rules', null=False)

    def match(self, entry):
        return re.search(self.regex_text, entry, re.IGNORECASE)