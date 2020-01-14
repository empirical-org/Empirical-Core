from django.db import models

class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class DjangoChoices():
    @classmethod
    def get_for_choices(cls):
        return [(getattr(cls, attr), getattr(cls, attr)) for attr in dir(cls)
                if not attr.startswith('_') and not attr == 'get_for_choices']


from .activity import *
from .regex_rule_set import *