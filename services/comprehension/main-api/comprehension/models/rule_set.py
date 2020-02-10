from django.db import models

from . import DjangoChoices, BaseModel
from .prompt import Prompt


class RuleSet(BaseModel):
    class PASS_ORDER(DjangoChoices):
        FIRST = 'first'
        SECOND = 'second'

    class REGEX_MATCH_TYPES(DjangoChoices):
        ALL = 'all'
        ANY = 'any'

    prompt = models.ForeignKey(Prompt,
                               on_delete=models.CASCADE,
                               related_name='rule_sets')
    name = models.TextField(null=False)
    feedback = models.TextField(null=False)
    priority = models.IntegerField(null=False, default=1)
    pass_order = models.TextField(null=False,
                                  choices=PASS_ORDER.get_for_choices())
    match = models.TextField(null=False,
                             default=REGEX_MATCH_TYPES.ALL,
                             choices=REGEX_MATCH_TYPES.get_for_choices())

    class Meta:
        unique_together = ('prompt', 'priority', 'pass_order', )
