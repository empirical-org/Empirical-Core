from django.db import models

from . import TimestampedModel


class Passage(TimestampedModel):
    text = models.TextField(null=False)
