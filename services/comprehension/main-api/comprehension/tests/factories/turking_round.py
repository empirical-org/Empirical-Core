from datetime import datetime
from pytz import utc

import factory
from .activity import ActivityFactory
from ...models.turking_round import TurkingRound


class TurkingRoundFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TurkingRound

    expires_at = utc.localize(datetime.now())
    activity = factory.SubFactory(ActivityFactory)
