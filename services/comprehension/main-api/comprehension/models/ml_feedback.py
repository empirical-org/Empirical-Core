from django.db import models

from . import TimestampedModel
from .ml_model import MLModel
from .prompt import Prompt


class MLFeedback(TimestampedModel):
    DEFAULT_FEEDBACK_LABEL = 'Default'

    feedback = models.TextField(null=False)
    combined_labels = models.TextField(null=False)
    prompt = models.ForeignKey(Prompt, on_delete=models.PROTECT,
                               related_name='ml_feedback')

    class Meta:
        unique_together = ('combined_labels', 'prompt')

    @classmethod
    def get_for_labels(cls, prompt_id, labels):
        combined_labels = cls.combine_labels(labels)
        try:
            return cls.objects.get(prompt_id=prompt_id,
                                   combined_labels=combined_labels)
        except cls.DoesNotExist:
            return cls.get_default(prompt_id)

    @classmethod
    def get_default(cls, prompt_id):
        return cls.objects.get(prompt_id=prompt_id,
                               combined_labels=cls.DEFAULT_FEEDBACK_LABEL)

    @classmethod
    def combine_labels(cls, labels):
        return '_'.join(sorted(labels))
