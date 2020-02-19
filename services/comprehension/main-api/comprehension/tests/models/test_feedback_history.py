from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.feedback_history import FeedbackHistoryFactory


class FeedbackHistoryModelTest(TestCase):
    def setUp(self):
        self.history = FeedbackHistoryFactory()

    def test_attempt_not_null(self):
        self.history.attempt = None
        with self.assertRaises(ValidationError):
            self.history.save()

    def test_entry_not_null(self):
        self.history.entry = None
        with self.assertRaises(ValidationError):
            self.history.save()

    def test_session_id_nullable(self):
        self.history.session_id = None
        self.history.save()
