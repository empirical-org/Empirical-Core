from django.db import models

from . import DjangoChoices, BaseModel


class RuleSet(BaseModel):
    class PASS_ORDER(DjangoChoices):
        FIRST = 'first'
        SECOND = 'second'

    class REGEX_MATCH_TYPES(DjangoChoices):
        ALL = 'all'
        ANY = 'any'

    name = models.TextField(null=False)
    feedback = models.TextField(null=False)
    priority = models.IntegerField(null=False, default=1)
    pass_order = models.TextField(null=False,
                                  default=PASS_ORDER.FIRST,
                                  choices=PASS_ORDER.get_for_choices())
    match = models.TextField(null=False,
                             default=REGEX_MATCH_TYPES.ALL,
                             choices=REGEX_MATCH_TYPES.get_for_choices())

    def process_rule_set(self, entry):
        rules_list = self.rules.all()
        if self.match == self.REGEX_MATCH_TYPES.ALL:
            return self._process_match_all(rules_list, entry)
        elif self.match == self.REGEX_MATCH_TYPES.ANY:
            return self._process_match_any(rules_list,
                                           entry)
        else:
            return True

    def _process_match_any(self, rules_list, entry):
        # match 'any' returns CORRECT at the first match it finds
        if not rules_list:
            return True

        for rule in rules_list:
            if rule.match(entry):
                break
        else:
            return False

        return True

    def _process_match_all(self, rules_list, entry):
        # match 'all' returns CORRECT after checking the whole list
        # and verifying all items are correct
        for rule in rules_list:
            if not rule.match(entry):
                return False

        return True

    @property
    def prompt_ids(self):
        return list(self.prompts.values_list('id', flat=True))

    @staticmethod
    def get_next_rule_set_priority_for_activity(activity):
        rule_sets = RuleSet.objects.filter(prompts__in=activity.prompts.all())
        if not rule_sets:
            return 0
        return rule_sets.latest('priority').priority + 1
