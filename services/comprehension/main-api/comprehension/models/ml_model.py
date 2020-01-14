from django.db import models

from . import TimestampedModel


class MLModel(TimestampedModel):
    project_id = models.TextField(null=False)
    compute_region = models.TextField(null=False)
    model_id = models.TextField(null=False)
