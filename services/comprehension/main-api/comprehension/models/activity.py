from django.db import models

from . import DjangoChoices, TimestampedModel


class Activity(TimestampedModel):
    class FLAGS(DjangoChoices):
        DRAFT = 'draft'
        BETA = 'beta'
        PRODUCTION = 'production'
        ARCHIVED = 'archived'

    title = models.TextField(null=False)
    flag = models.TextField(null=False, choices=FLAGS.get_for_choices())
