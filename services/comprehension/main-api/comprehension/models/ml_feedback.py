from django.db import models

from . import TimestampedModel


class MLFeedback(TimestampedModel):
    DEFAULT_FEEDBACK_LABEL = 'Default'

    combined_labels = models.TextField(null=False)
    feedback = models.TextField(null=False)
    optimal = models.BooleanField(null=False, default=False)
    order = models.PositiveIntegerField(default=0)
    prompt = models.ForeignKey('Prompt', on_delete=models.PROTECT,
                               related_name='ml_feedback')

    class Meta:
        unique_together = ('prompt', 'combined_labels', 'order')
