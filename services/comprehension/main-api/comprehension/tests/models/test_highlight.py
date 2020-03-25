from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.highlight import HighlightFactory


class HighlightModelTest(TestCase):
    def setUp(self):
        self.highlight = HighlightFactory()

    def test_highlight_text_not_nullable(self):
        self.highlight.highlight_text = None
        with self.assertRaises(ValidationError):
            self.highlight.save()

    def test_start_index_not_nullable(self):
        self.highlight.start_index = None
        with self.assertRaises(ValidationError):
            self.highlight.save()

    def test_flag_validation(self):
        self.highlight.highlight_type = 'DEFINITELY NOT A VALID TYPE'
        with self.assertRaises(ValidationError):
            self.highlight.save()
