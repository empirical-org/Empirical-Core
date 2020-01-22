from django.db import models

from . import BaseModel
from .rule_set import RuleSet
import re

NO_REGEX_FLAGS = 0


class Rule(BaseModel):
    regex_text = models.TextField(null=False)
    rule_set = models.ForeignKey(RuleSet,
                                 on_delete=models.CASCADE,
                                 related_name='rules',
                                 null=False)
    case_sensitive = models.BooleanField(null=False,
                                         default=False)

    def _match_for_contains(self, entry, flags):
        return re.search(self.regex_text, entry, flags)

    def _match_for_does_not_contain(self, entry, flags):
        return not re.search(self.regex_text, entry, flags)

    def match(self, entry):
        flags = NO_REGEX_FLAGS if self.case_sensitive else re.IGNORECASE
        if self.rule_set.test_for_contains:
            return self._match_for_contains(entry, flags)
        else:
            return self._match_for_does_not_contain(entry, flags)
