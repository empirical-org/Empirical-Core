from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.ml_feedback import MLFeedbackFactory
from ..factories.ml_model import MLModelFactory
from ..factories.prompt import PromptFactory
from ..factories.rule_set import RuleSetFactory
from ..factories.rule import RuleFactory
from ...models.ml_model import MLModel
from ...models.prompt import Prompt
from ...models.rule_set import RuleSet


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


class PromptVariableAutoMLFeedbackTest(PromptModelTest):
    def setUp(self):
        super().setUp()
        self.feedback2 = MLFeedbackFactory(
            combined_labels=self.feedback.combined_labels,
            prompt=self.prompt,
            order=self.feedback.order + 1
        )

    @patch.object(MLModel, 'request_labels')
    def test_variable_feedback(self, label_mock):
        label_mock.return_value = ['Test1', 'Test2']
        mock_previous_feedback = [{
            'labels': self.feedback.combined_labels
        }]
        response = self.prompt.fetch_auto_ml_feedback(
            None,
            previous_feedback=mock_previous_feedback
        )
        self.assertTrue(label_mock.called)
        self.assertEqual(self.feedback2, response)

    @patch.object(MLModel, 'request_labels')
    def test_variable_feedback_wrap_around(self, label_mock):
        label_mock.return_value = ['Test1', 'Test2']
        mock_previous_feedback = [{
            'labels': self.feedback.combined_labels
        }, {
            'labels': self.feedback.combined_labels
        }]
        response = self.prompt.fetch_auto_ml_feedback(
            None,
            previous_feedback=mock_previous_feedback
        )
        self.assertTrue(label_mock.called)
        self.assertEqual(self.feedback, response)


class PromptFetchRulesBasedFeedbackTest(PromptModelTest):
    def test_first_pass(self):
        rule_set = (RuleSetFactory(
                    feedback='Test feedback',
                    pass_order=RuleSet.PASS_ORDER.FIRST,
                    prompt=self.prompt))
        RuleFactory(regex_text='^test', rule_set=rule_set)
        feedback = (self.prompt.
                    fetch_rules_based_feedback('incorrect test correct',
                                               RuleSet.PASS_ORDER.FIRST))
        self.assertFalse(feedback['optimal'])
        self.assertEqual(feedback['feedback'], 'Test feedback')

    def test_second_pass(self):
        rule_set = (RuleSetFactory(feedback='Test feedback',
                                   pass_order=RuleSet.PASS_ORDER.SECOND,
                                   prompt=self.prompt))
        RuleFactory(regex_text='^test', rule_set=rule_set)
        feedback = (self.prompt.
                    fetch_rules_based_feedback('incorrect test correct',
                                               RuleSet.PASS_ORDER.SECOND))
        self.assertFalse(feedback['optimal'])
        self.assertEqual(feedback['feedback'], 'Test feedback')

    def test_match_all_regex(self):
        rule_set = (RuleSetFactory(
                    feedback='Test feedback',
                    pass_order=RuleSet.PASS_ORDER.FIRST,
                    prompt=self.prompt,
                    match='all'))
        rule_set_two = (RuleSetFactory(
                        feedback='Test feedback',
                        pass_order=RuleSet.PASS_ORDER.FIRST,
                        prompt=self.prompt,
                        priority=2,
                        match='all'))
        RuleFactory(regex_text='incorrect sequence', rule_set=rule_set)
        RuleFactory(regex_text='wrong sequence', rule_set=rule_set_two)
        feedback = (self.prompt.
                    fetch_rules_based_feedback('test wrong sequence',
                                               RuleSet.PASS_ORDER.FIRST))
        self.assertFalse(feedback['optimal'])
        self.assertEqual(feedback['feedback'], 'Test feedback')

    def test_match_any_regex(self):
        rule_set = (RuleSetFactory(
                    feedback='Test feedback',
                    pass_order=RuleSet.PASS_ORDER.FIRST,
                    prompt=self.prompt,
                    match='any'))
        rule_set_two = (RuleSetFactory(
                        feedback='Test feedback',
                        pass_order=RuleSet.PASS_ORDER.FIRST,
                        prompt=self.prompt,
                        priority=2,
                        match='any'))
        RuleFactory(regex_text='^test', rule_set=rule_set)
        RuleFactory(regex_text='test$', rule_set=rule_set_two)
        feedback = (self.prompt.
                    fetch_rules_based_feedback('test wrong sequence',
                                               RuleSet.PASS_ORDER.FIRST))
        self.assertFalse(feedback['optimal'])
        self.assertEqual(feedback['feedback'], 'Test feedback')

    def test_two_rules_in_rule_set(self):
        rule_set = (RuleSetFactory(
                    feedback='Test feedback',
                    pass_order=RuleSet.PASS_ORDER.FIRST,
                    prompt=self.prompt,
                    match='any'))

        RuleFactory(regex_text='^test', rule_set=rule_set)
        RuleFactory(regex_text='teeest$', rule_set=rule_set)

        feedback = (self.prompt.
                    fetch_rules_based_feedback('test correct teeest',
                                               RuleSet.PASS_ORDER.FIRST))
        feedback_two = (self.prompt.
                        fetch_rules_based_feedback('test teeest',
                                                   RuleSet.PASS_ORDER.FIRST))
        feedback_three = (self.prompt.
                          fetch_rules_based_feedback('teest test incorrect',
                                                     RuleSet.PASS_ORDER.FIRST))
        self.assertTrue(feedback['optimal'])
        self.assertTrue(feedback_two['optimal'])
        self.assertFalse(feedback_three['optimal'])
