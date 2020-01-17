from django.db import models

from . import TimestampedModel
from .ml_model import MLModel


class Label(TimestampedModel):
    text = models.TextField(null=False)
    ml_model = models.ForeignKey(MLModel, on_delete=models.PROTECT,
                                 related_name='labels')
