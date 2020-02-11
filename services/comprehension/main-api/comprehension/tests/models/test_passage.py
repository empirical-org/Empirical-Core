from django.core.exceptions import ValidationError
from django.test import TestCase

from ...models.passage import Passage


class PassageModelTest(TestCase):
    def test_text_not_null(self):
        with self.assertRaises(ValidationError):
            Passage.objects.create(text=None)
