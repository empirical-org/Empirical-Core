from django.db import models


class BaseModel(models.Model):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)


class TimestampedModel(BaseModel):
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