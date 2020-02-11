from django.db import models

from . import TimestampedModel
from .ml_feedback import MLFeedback
from .ml_model import MLModel
from ..exceptions import ComprehensionException
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

    class NoDefaultMLFeedbackError(ComprehensionException):
        """
        To flag cases where default feedback is needed but unavailable
        """
        pass

    class NoFeedbackOptionsToChooseFromError(ComprehensionException):
        """
        Raised if the prompt is asked to select a Feedback instance but
        is given no instances to select from
        """
        pass

    def fetch_rules_based_feedback(self, entry, pass_order):
        rule_sets = (self.rule_sets.filter(pass_order=pass_order).
                     order_by('priority').all())

        for rule_set in rule_sets:
            is_passing = rule_set.process_rule_set(entry)
            if not is_passing:
                feedback = INCORRECT_FEEDBACK_OBJ
                feedback.update(feedback=rule_set.feedback)
                return feedback

        return CORRECT_FEEDBACK_OBJ

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
        feedback_options = self._fetch_feedback_options(combined_labels)
        if not feedback_options:
            feedback_options = self._get_default_feedback()
        return self._choose_feedback(combined_labels,
                                     previous_feedback,
                                     feedback_options)

    def _choose_feedback(self, combined_labels, previous_feedback,
                         feedback_options):
        filtered_feedback = list(filter(self._filter_feedback(combined_labels),
                                        previous_feedback))
        label_match_count = len(filtered_feedback)
        available_feedback_count = len(feedback_options)

        try:
            next_feedback_index = label_match_count % available_feedback_count
        except ZeroDivisionError:
            msg = (f'No feedback options found for Prompt {self.id} with '
                   f'label combination {combined_labels}.')
            raise self.NoFeedbackOptionsToChooseFromError(msg)
        return feedback_options[next_feedback_index]

    def _get_default_feedback(self):
        default_label = MLFeedback.DEFAULT_FEEDBACK_LABEL
        feedback = self._fetch_feedback_options(default_label)
        if not feedback:
            raise self.NoDefaultMLFeedbackError(f'Prompt {self.id}')
        return feedback

    def _fetch_feedback_options(self, combined_labels):
        return (self.ml_feedback
                    .filter(combined_labels=combined_labels)
                    .order_by('order')
                    .all())

    @staticmethod
    def _filter_feedback(labels):
        return lambda x: x.get('labels') == labels
