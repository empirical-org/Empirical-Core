from django.db import models

from . import TimestampedModel
from .ml_feedback import MLFeedback
from .ml_model import MLModel
from ..utils import combine_labels


CORRECT_FEEDBACK_OBJ = {
                          'feedback': 'All rules-based checks passed!',
                          'optimal': True
                       }
INCORRECT_FEEDBACK_OBJ = {
                            'feedback': '',
                            'optimal': False
                        }


class Prompt(TimestampedModel):
    text = models.TextField(null=False)
    max_attempts = models.PositiveIntegerField(default=5)
    max_attempts_feedback = models.TextField(null=False)
    ml_model = models.ForeignKey(MLModel, on_delete=models.PROTECT,
                                 related_name='prompts', null=True)

    def fetch_rules_based_feedback(self, entry, pass_order):
        rule_sets = (self.rule_sets.filter(pass_order=pass_order).
                     order_by('priority').all())

        for rule_set in rule_sets:
            rules_list = rule_set.rules.all()
            if rule_set.match == 'any':
                is_passing = self._process_match_all(rules_list, entry)
            elif rule_set.match == 'all':
                is_passing = self._process_match_any(rules_list,
                                                     entry)
            else:
                is_passing = True

            if not is_passing:
                feedback = INCORRECT_FEEDBACK_OBJ
                feedback.update(feedback=rule_set.feedback)
                return feedback

        return CORRECT_FEEDBACK_OBJ

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

    def fetch_auto_ml_feedback(self, entry, previous_feedback=[],
                               multi_label=True):
        if multi_label:
            labels = self._request_ml_labels(entry)
        else:
            labels = self._request_single_ml_label(entry)
        return self._get_feedback_for_labels(labels, previous_feedback)

    def _request_single_ml_label(self, entry):
        return self.ml_model.request_single_label(entry)

    def _request_ml_labels(self, entry):
        return self.ml_model.request_labels(entry)

    def _get_feedback_for_labels(self, labels, previous_feedback=[]):
        combined_labels = combine_labels(labels)
        filtered_feedback = list(filter(self._filter_feedback(combined_labels),
                                        previous_feedback))
        label_match_count = len(filtered_feedback)
        feedback_options = (self.ml_feedback
                                .filter(combined_labels=combined_labels)
                                .order_by('order')
                                .all())
        available_feedback_count = len(feedback_options)

        if not available_feedback_count:
            return self._get_default_feedback()

        next_feedback_index = label_match_count % available_feedback_count
        return feedback_options[next_feedback_index]

    def _get_default_feedback(self):
        default_label = MLFeedback.DEFAULT_FEEDBACK_LABEL
        return self.ml_feedback.get(combined_labels=default_label)

    @staticmethod
    def _filter_feedback(labels):
        return lambda x: x.get('labels') == labels
