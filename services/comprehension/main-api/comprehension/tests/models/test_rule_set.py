from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.prompt import PromptFactory
from ..factories.rule_set import RuleSetFactory
from ..factories.rule import RuleFactory
from ...models.rule_set import RuleSet


class RuleSetModelTest(TestCase):
    def setUp(self):
        self.rule_set = RuleSetFactory()
        self.prompt = PromptFactory()


class RuleSetValidationTest(RuleSetModelTest):
    def test_name_not_nullable(self):
        self.rule_set.name = None
        with self.assertRaises(ValidationError):
            self.rule_set.save()

    def test_feedback_not_nullable(self):
        self.rule_set.feedback = None
        with self.assertRaises(ValidationError):
            self.rule_set.save()

    def test_priority_unique_on_prompt_id(self):
        self.rule_set_duplicate = RuleSet(prompt=self.rule_set.prompt,
                                          name="duplicate",
                                          pass_order=self.rule_set.pass_order,
                                          feedback="duplicate",
                                          priority=self.rule_set.priority)
        with self.assertRaises(ValidationError):
            self.rule_set_duplicate.save()

    def test_pass_order_validation(self):
        self.rule_set.pass_order = 'DEFINITELY NOT A VALID FLAG'
        with self.assertRaises(ValidationError):
            self.rule_set.save()


class RuleSetFunctionTest(RuleSetModelTest):
    def test_first_pass(self):
        rule_set = (RuleSetFactory(
                    feedback='Test feedback',
                    pass_order=RuleSet.PASS_ORDER.FIRST,
                    prompt=self.prompt))
        RuleFactory(regex_text='^test', rule_set=rule_set)
        result = rule_set.process_rule_set('incorrect test correct')
        self.assertFalse(result)
        result = rule_set.process_rule_set('test correct')
        self.assertTrue(result)

    def test_second_pass(self):
        rule_set = (RuleSetFactory(feedback='Test feedback',
                                   pass_order=RuleSet.PASS_ORDER.SECOND,
                                   prompt=self.prompt))
        RuleFactory(regex_text='^test', rule_set=rule_set)
        result = rule_set.process_rule_set('incorrect test correct')
        self.assertFalse(result)
        result = rule_set.process_rule_set('test correct')
        self.assertTrue(result)

    def test_match_all_regex(self):
        prompt = PromptFactory()
        rule_set = (RuleSetFactory(
                    feedback='Test feedback',
                    pass_order=RuleSet.PASS_ORDER.FIRST,
                    prompt=prompt,
                    match='all'))
        RuleFactory(regex_text='incorrect sequence', rule_set=rule_set)
        result = rule_set.process_rule_set('test incorrect sequence')
        self.assertFalse(result)
        result = rule_set.process_rule_set('this is a perfect test')
        self.assertTrue(result)

    def test_match_any_regex(self):
        rule_set = (RuleSetFactory(
                    feedback='Test feedback',
                    pass_order=RuleSet.PASS_ORDER.FIRST,
                    prompt=self.prompt,
                    match='any'))
        RuleFactory(regex_text='^test', rule_set=rule_set)
        result = rule_set.process_rule_set('wrong sequence test')
        self.assertFalse(result)
        result = rule_set.process_rule_set('test correct sequence test')
        self.assertTrue(result)

    def test_two_rules_in_rule_set(self):
        rule_set = (RuleSetFactory(
                    feedback='Test feedback',
                    pass_order=RuleSet.PASS_ORDER.FIRST,
                    prompt=self.prompt,
                    match='any'))

        RuleFactory(regex_text='^test', rule_set=rule_set)
        RuleFactory(regex_text='teeest$', rule_set=rule_set)

        result_one = rule_set.process_rule_set('test correct teest')
        result_two = rule_set.process_rule_set('test teeest')
        result_three = rule_set.process_rule_set('teest test incorrect')

        self.assertTrue(result_one)
        self.assertTrue(result_two)
        self.assertFalse(result_three)
