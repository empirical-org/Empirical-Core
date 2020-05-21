from datetime import datetime
from pytz import utc

from django.db import models

from . import TimestampedModel
from .activity import Activity


class TurkingRound(TimestampedModel):
    activity = models.ForeignKey(Activity, on_delete=models.PROTECT,
                                 related_name='turking_rounds', null=False)
    expires_at = models.DateTimeField(null=False)

    @property
    def expired(self):
        return self.expires_at < utc.localize(datetime.now())
