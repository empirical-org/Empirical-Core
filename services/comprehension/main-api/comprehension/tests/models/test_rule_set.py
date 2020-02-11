from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.rule import RuleFactory
from ..factories.rule_set import RuleSetFactory
from ...models.rule_set import RuleSet


class RuleSetModelTest(TestCase):
    def setUp(self):
        self.rule_set = RuleSetFactory()

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


class RuleModelTest(TestCase):
    def setUp(self):
        self.rule = RuleFactory(regex_text='^test', case_sensitive=False)

    def test_regex_text_not_nullable(self):
        self.rule.regex_text = None
        with self.assertRaises(ValidationError):
            self.rule.save()

    def test_rule_set_not_nullable(self):
        self.rule.rule_set = None
        with self.assertRaises(ValidationError):
            self.rule.save()

    def test_match_case_insensitive(self):
        self.assertTrue(self.rule.match('test matches ^test'))
        self.assertTrue(self.rule.match('TeSt matches ^test'))
        self.assertFalse(self.rule.match('WRONG does not match ^test'))

    def test_match_case_sensitive(self):
        self.rule = RuleFactory(regex_text='^test', case_sensitive=True)
        self.assertTrue(self.rule.match('test matches ^test'))
        self.assertFalse(self.rule.match('TeSt matches ^test'))
