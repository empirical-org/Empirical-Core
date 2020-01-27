from django.db import models

from . import TimestampedModel
from .ml_feedback import MLFeedback
from .ml_model import MLModel
from ..utils import combine_labels


class Prompt(TimestampedModel):
    text = models.TextField(null=False)
    max_attempts = models.PositiveIntegerField(default=5)
    max_attempts_feedback = models.TextField(null=False)
    ml_model = models.ForeignKey(MLModel, on_delete=models.PROTECT,
                                 related_name='prompts', null=True)

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
