from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.ml_feedback import MLFeedbackFactory
from ..factories.prompt import PromptFactory
from ...models.ml_feedback import MLFeedback


class TestMLFeedback(TestCase):
    def setUp(self):
        self.prompt = PromptFactory()
        self.feedback = MLFeedbackFactory(combined_labels='Test1_Test2',
                                          prompt=self.prompt)
        self.default = MLFeedbackFactory(feedback='Default feedback',
                                         prompt=self.prompt)

    def test_prompt_id_and_combined_labels_and_order_is_unique(self):
        with self.assertRaises(ValidationError):
            combined_labels = self.feedback.combined_labels
            MLFeedback.objects.create(feedback='New feedback',
                                      combined_labels=combined_labels,
                                      prompt=self.feedback.prompt,
                                      order=self.feedback.order)
