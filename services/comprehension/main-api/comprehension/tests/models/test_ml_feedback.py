from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.ml_feedback import MLFeedbackFactory
from ..factories.prompt import PromptFactory
from ...models.ml_feedback import MLFeedback


class TestMLFeedback(TestCase):
    def setUp(self):
        self.maxDiff = None
        self.prompt = PromptFactory()
        self.feedback = MLFeedbackFactory(combined_labels='Test1_Test2',
                                          prompt=self.prompt)
        self.default = MLFeedbackFactory(feedback='Default feedback',
                                         prompt=self.prompt)

    def test_prompt_id_and_combined_labels_is_unique(self):
        with self.assertRaises(ValidationError):
            MLFeedback.objects.create(feedback='New feedback',
                                      combined_labels=self.feedback.combined_labels,
                                      prompt=self.feedback.prompt)

    def test_get_for_labels_single_label(self):
        feedback = MLFeedbackFactory(combined_labels='Test1',
                                     prompt=self.prompt)
        retrieved_feedback = MLFeedback.get_for_labels(self.prompt.id,
                                                       ['Test1'])
        self.assertEqual(feedback, retrieved_feedback)

    def test_get_for_labels_muiltiple_labels(self):
        retrieved_feedback = MLFeedback.get_for_labels(self.prompt.id,
                                                       ['Test1', 'Test2'])
        self.assertEqual(self.feedback, retrieved_feedback)

    @patch.object(MLFeedback, 'get_default')
    def test_get_for_labels_fallback_to_default(self, get_default_mock):
        MLFeedback.get_for_labels(self.prompt.id,
                                  ['Not', 'Used'])
        self.assertTrue(get_default_mock.called)

    def test_get_default(self):
        self.assertEqual(MLFeedback.get_default(self.prompt.id), self.default)

    def test_combine_labels(self):
        labels = ['Comprehension', 'Accuracy', 'Foo']
        self.assertEqual(MLFeedback.combine_labels(labels),
                         'Accuracy_Comprehension_Foo')
