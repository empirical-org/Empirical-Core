from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.ml_feedback import MLFeedbackFactory
from ..factories.ml_model import MLModelFactory
from ..factories.prompt import PromptFactory
from ...models.ml_model import MLModel
from ...models.prompt import Prompt


class PromptModelTest(TestCase):
    def setUp(self):
        self.prompt = PromptFactory()
        self.feedback = MLFeedbackFactory(combined_labels='Test1_Test2',
                                          prompt=self.prompt)
        self.default = MLFeedbackFactory(feedback='Default feedback',
                                         prompt=self.prompt)


class PromptValidationTest(PromptModelTest):
    def test_text_not_null(self):
        with self.assertRaises(ValidationError):
            Prompt.objects.create(max_attempts_feedback='foo',
                                  ml_model=MLModelFactory())

    def test_default_max_attempts(self):
        prompt = Prompt.objects.create(text='foo', max_attempts_feedback='bar',
                                       ml_model=MLModelFactory())
        self.assertEqual(prompt.max_attempts, 5)


class PromptFunctionTest(PromptModelTest):
    def test_max_attempts_feedback_not_null(self):
        with self.assertRaises(ValidationError):
            Prompt.objects.create(text='foo', ml_model=MLModelFactory())

    def test_get_for_labels_single_label(self):
        feedback = MLFeedbackFactory(combined_labels='Test1',
                                     prompt=self.prompt)
        retrieved_feedback = self.prompt._get_feedback_for_labels(['Test1'])
        self.assertEqual(feedback, retrieved_feedback)

    def test_get_for_labels_muiltiple_labels(self):
        retrieved_feedback = self.prompt._get_feedback_for_labels(['Test1',
                                                                   'Test2'])
        self.assertEqual(self.feedback, retrieved_feedback)

    @patch.object(Prompt, '_get_default_feedback')
    def test_get_for_labels_fallback_to_default(self, get_default_mock):
        self.prompt._get_feedback_for_labels(['Not', 'Used'])
        self.assertTrue(get_default_mock.called)

    def test_get_default(self):
        self.assertEqual(self.prompt._get_default_feedback(), self.default)


class PromptFetchAutoMLFeedbackTest(PromptModelTest):
    @patch.object(MLModel, 'request_single_label')
    def test_single_label(self, label_mock):
        feedback = MLFeedbackFactory(combined_labels='Test1',
                                     prompt=self.prompt)
        label_mock.return_value = ['Test1']
        response = self.prompt.fetch_auto_ml_feedback(None, multi_label=False)
        self.assertTrue(label_mock.called)
        self.assertEqual(feedback, response)

    @patch.object(MLModel, 'request_labels')
    def test_multi_label(self, label_mock):
        label_mock.return_value = ['Test1', 'Test2']
        response = self.prompt.fetch_auto_ml_feedback(None)
        self.assertTrue(label_mock.called)
        self.assertEqual(self.feedback, response)
