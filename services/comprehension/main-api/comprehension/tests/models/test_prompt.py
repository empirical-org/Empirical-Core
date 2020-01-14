from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.ml_model import MLModelFactory
from ...models.prompt import Prompt


class PromptModelTest(TestCase):
    def test_text_not_null(self):
        with self.assertRaises(ValidationError):
            Prompt.objects.create(max_attempts_feedback='foo',
                                  ml_model=MLModelFactory())

    def test_default_max_attempts(self):
        prompt = Prompt.objects.create(text='foo', max_attempts_feedback='bar',
                                       ml_model=MLModelFactory())
        self.assertEqual(prompt.max_attempts, 5)

    def test_max_attempts_feedback_not_null(self):
        with self.assertRaises(ValidationError):
            Prompt.objects.create(text='foo', ml_model=MLModelFactory())

    def test_request_ml_labels(self):

    def test_calculate_ml_feedback(self):
