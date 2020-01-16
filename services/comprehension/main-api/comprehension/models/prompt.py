from django.db import models

from . import TimestampedModel


class Prompt(TimestampedModel):
    text = models.TextField(null=False)
    max_attempts = models.PositiveIntegerField(default=5)
    max_attempts_feedback = models.TextField(null=False)

    def process_regex_rules(entry, pass_order):
        response_data = {
            'feedback_type': 'rules-based',
            'response_uid': 'q23123@3sdfASDF',
            'feedback': 'All rules-based checks passed!',
            'optimal': True,
            'highlight': []
        }

        regex_rule_sets = prompt.rule_sets.get(
                    pass_order=pass_order)
                    .order_by('priority')

        for regex_rule_set in regex_rule_sets:
            for rule in regex_rule_set.rules:
                if not rule.match(entry):
                    response_data.update({
                        'feedback': regex_rule_set.feedback
                        'optimal': False
                    })
                    return response_data

        return response_data
