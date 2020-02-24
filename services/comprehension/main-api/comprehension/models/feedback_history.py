from django.db import models
from django.contrib.postgres.fields import JSONField

from . import TimestampedModel


class FeedbackHistory(TimestampedModel):
    attempt = models.PositiveIntegerField(null=False)
    entry = models.TextField(null=False)
    feedback = JSONField()
    feedback_optimal = models.BooleanField(null=False)
    feedback_text = models.TextField(null=False)
    feedback_type = models.TextField(null=False)
    prompt = models.ForeignKey('Prompt', on_delete=models.PROTECT,
                               related_name='feedback_history')
    session_id = models.TextField(blank=True, null=True)
