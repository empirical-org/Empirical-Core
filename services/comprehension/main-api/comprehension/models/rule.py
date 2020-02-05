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

    def _focus_point_match(self, entry, flags):
        return re.search(self.regex_text, entry, flags)

    def _incorrect_sequence_match(self, entry, flags):
        return not re.search(self.regex_text, entry, flags)

    def match(self, entry):
        flags = NO_REGEX_FLAGS if self.case_sensitive else re.IGNORECASE
        if self.rule_set.is_focus_point:
            return self._focus_point_match(entry, flags)
        else:
            return self._incorrect_sequence_match(entry, flags)
