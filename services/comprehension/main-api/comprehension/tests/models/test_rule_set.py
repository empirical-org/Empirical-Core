from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.prompt import PromptFactory
from ..factories.activity import ActivityFactory
from ..factories.activity_prompt import ActivityPromptFactory
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

    def test_pass_order_validation(self):
        self.rule_set.pass_order = 'DEFINITELY NOT A VALID FLAG'
        with self.assertRaises(ValidationError):
            self.rule_set.save()


class RuleSetAttributesTest(RuleSetModelTest):
    def test_prompt_ids_property(self):
        rule_set = RuleSetFactory()
        prompt = PromptFactory()
        prompt.rule_sets.add(rule_set)
        self.assertEqual(rule_set.prompt_ids, [prompt.id])

    def test_default_pass_order(self):
        new_rule_set = RuleSet(name='test', feedback='test')
        new_rule_set.save()
        self.assertEqual(new_rule_set.pass_order, RuleSet.PASS_ORDER.FIRST)


class RuleSetFunctionTest(RuleSetModelTest):
    def test_first_pass(self):
        rule_set = (RuleSetFactory(
                    feedback='Test feedback',
                    pass_order=RuleSet.PASS_ORDER.FIRST))
        RuleFactory(regex_text='^test', rule_set=rule_set)
        result = rule_set.process_rule_set('incorrect test correct')
        self.assertFalse(result)
        result = rule_set.process_rule_set('test correct')
        self.assertTrue(result)

    def test_second_pass(self):
        rule_set = (RuleSetFactory(feedback='Test feedback',
                                   pass_order=RuleSet.PASS_ORDER.SECOND))
        RuleFactory(regex_text='^test', rule_set=rule_set)
        result = rule_set.process_rule_set('incorrect test correct')
        self.assertFalse(result)
        result = rule_set.process_rule_set('test correct')
        self.assertTrue(result)

    def test_match_all_regex(self):
        rule_set = (RuleSetFactory(
                    feedback='Test feedback',
                    pass_order=RuleSet.PASS_ORDER.FIRST,
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
                    match='any'))

        RuleFactory(regex_text='^test', rule_set=rule_set)
        RuleFactory(regex_text='teeest$', rule_set=rule_set)

        result_one = rule_set.process_rule_set('test correct teest')
        result_two = rule_set.process_rule_set('test teeest')
        result_three = rule_set.process_rule_set('teest test incorrect')

        self.assertTrue(result_one)
        self.assertTrue(result_two)
        self.assertFalse(result_three)

    def test_prompt_ids_property(self):
        rule_set = RuleSetFactory()
        prompt = PromptFactory()
        prompt.rule_sets.add(rule_set)
        self.assertEqual(rule_set.prompt_ids, [prompt.id])

    def test_get_next_rule_set_priority_for_activity(self):
        self.prompt = PromptFactory()
        self.activity = ActivityFactory()
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)
        self.assertEqual(RuleSet
                         .get_next_rule_set_priority_for_activity(
                             self.activity
                             ), 0)

        self.prompt.rule_sets.add(RuleSetFactory())
        self.prompt.rule_sets.add(RuleSetFactory())
        self.assertEqual(RuleSet
                         .get_next_rule_set_priority_for_activity(
                             self.activity
                             ), 2)
