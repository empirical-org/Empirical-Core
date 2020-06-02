from django.db import models

from . import TimestampedModel
from .prompt import Prompt
from ..exceptions import ComprehensionException


class PromptEntry(TimestampedModel):
    entry = models.TextField(null=False)
    prompt = models.ForeignKey(Prompt, on_delete=models.PROTECT,
                               related_name='prompt_entries', null=False)

    class Meta:
        unique_together = ('prompt', 'entry')

    class ModelUpdateNotAllowedError(ComprehensionException):
        """
        To flag cases where default feedback is needed but unavailable
        """
        pass

    def save(self, *args, **kwargs):
        """
        We want to make this model read-only
        """
        if self.id:
            msg = '{} is a read-only model'.format(self.__class__.__name__)
            raise self.ModelUpdateNotAllowedError(msg)
        super().save(*args, **kwargs)
