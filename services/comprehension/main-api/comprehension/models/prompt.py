from django.db import models

from . import TimestampedModel
from .ml_model import MLModel


class Prompt(TimestampedModel):
    text = models.TextField(null=False)
    max_attempts = models.PositiveIntegerField(default=5)
    max_attempts_feedback = models.TextField(null=False)
    ml_model = models.ForeignKey(MLModel, on_delete=models.PROTECT,
                                 related_name='prompts', null=True)

    def request_ml_labels(self, entry):
        return self.ml_model.request_labels(entry)

    def calculate_ml_feedback(self, labels):
        return self.ml_feedback.get_for_labels(labels)
