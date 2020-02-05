from django.db import models

from . import DjangoChoices, TimestampedModel
from .ml_feedback import MLFeedback


class Highlight(TimestampedModel):
    class TYPES(DjangoChoices):
        PASSAGE = 'passage'

    feedback = models.ForeignKey(
        'MLFeedback',
        on_delete=models.PROTECT,
        related_name='highlights'
    )
    highlight_text = models.TextField(null=False)
    highlight_type = models.TextField(
        null=False,
        choices=TYPES.get_for_choices()
    )
    start_index = models.PositiveIntegerField(default=0)
