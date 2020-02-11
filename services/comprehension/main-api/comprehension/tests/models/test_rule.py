from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.rule import RuleFactory


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
