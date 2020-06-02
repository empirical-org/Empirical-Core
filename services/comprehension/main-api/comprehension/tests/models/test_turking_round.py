from datetime import datetime, timedelta
from pytz import utc

from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.turking_round import TurkingRoundFactory


class TurkingRoundModelTest(TestCase):
    def setUp(self):
        self.turking_round = TurkingRoundFactory()

    def test_activity_not_nullable(self):
        self.turking_round.activity = None
        with self.assertRaises(ValidationError):
            self.turking_round.full_clean()

    def test_expires_at_not_nullable(self):
        self.turking_round.expires_at = None
        with self.assertRaises(ValidationError):
            self.turking_round.full_clean()

    def test_expired_property_expired(self):
        yesterday = utc.localize(datetime.now()) - timedelta(days=1)
        self.turking_round.expires_at = yesterday
        self.assertTrue(self.turking_round.expired)

    def test_expired_property_not_expired(self):
        tomorrow = utc.localize(datetime.now()) + timedelta(days=1)
        self.turking_round.expires_at = tomorrow
        self.assertFalse(self.turking_round.expired)
