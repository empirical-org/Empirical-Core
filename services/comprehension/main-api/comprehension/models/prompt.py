from django.db import models

from . import TimestampedModel
from .ml_feedback import MLFeedback
from .ml_model import MLModel
from ..utils import combine_labels

CORRECT_FEEDBACK = 'All rules-based checks passed!'


class Prompt(TimestampedModel):
    text = models.TextField(null=False)
    max_attempts = models.PositiveIntegerField(default=5)
    max_attempts_feedback = models.TextField(null=False)
    ml_model = models.ForeignKey(MLModel, on_delete=models.PROTECT,
                                 related_name='prompts', null=True)

    def fetch_rules_based_feedback(self, entry, pass_order):
        rule_sets = (self.rule_sets.filter(pass_order=pass_order).
                     order_by('priority').all())
        feedback = {
                     'feedback': CORRECT_FEEDBACK,
                     'optimal': True
                    }

        for rule_set in rule_sets:
            rules = rule_set.rules.all() if rule_set.rules else []
            for rule in rules:
                if not rule.match(entry):
                    feedback['feedback'] = rule_set.feedback
                    feedback['optimal'] = False
                    return feedback

        return feedback

    def fetch_auto_ml_feedback(self, entry, multi_label=True):
        if multi_label:
            labels = self._request_ml_labels(entry)
        else:
            labels = self._request_single_ml_label(entry)
        return self._get_feedback_for_labels(labels)

    def _request_single_ml_label(self, entry):
        return self.ml_model.request_single_label(entry)

    def _request_ml_labels(self, entry):
        return self.ml_model.request_labels(entry)

    def _get_feedback_for_labels(self, labels):
        combined_labels = combine_labels(labels)
        try:
            return self.ml_feedback.get(combined_labels=combined_labels)
        except MLFeedback.DoesNotExist:
            return self._get_default_feedback()

    def _get_default_feedback(self):
        default_label = MLFeedback.DEFAULT_FEEDBACK_LABEL
        return self.ml_feedback.get(combined_labels=default_label)
