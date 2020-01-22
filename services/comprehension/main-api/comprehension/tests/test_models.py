from django.core.exceptions import ValidationError
from django.test import TestCase

from .factories.activity import ActivityFactory
from .factories.activity_passage import ActivityPassageFactory
from .factories.activity_prompt import ActivityPromptFactory
from .factories.passage import PassageFactory
from .factories.prompt import PromptFactory
from .factories.rule_set import RuleSetFactory
from .factories.rule import RuleFactory
from ..models.passage import Passage
from ..models.rule_set import RuleSet


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = ActivityFactory()

    def test_title_not_nullable(self):
        self.activity.title = None
        with self.assertRaises(ValidationError):
            self.activity.save()

    def test_flag_validation(self):
        self.activity.flag = 'DEFINITELY NOT A VALID FLAG'
        with self.assertRaises(ValidationError):
            self.activity.save()

    def test_get_passages_order(self):
        self.passage1 = PassageFactory(text='passage1')
        self.passage2 = PassageFactory(text='passage2')
        ActivityPassageFactory(activity=self.activity,
                               passage=self.passage2,
                               order=1)
        ActivityPassageFactory(activity=self.activity,
                               passage=self.passage1,
                               order=2)

        self.assertEqual(self.activity.get_passages(),
                         [self.passage2, self.passage1])

    def test_get_prompts_order(self):
        self.prompt1 = PromptFactory(text='prompt1')
        self.prompt2 = PromptFactory(text='prompt2')
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt2,
                              order=1)
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt1,
                              order=2)

        self.assertEqual(self.activity.get_prompts(),
                         [self.prompt2, self.prompt1])


class PassageModelTest(TestCase):
    def test_text_not_null(self):
        with self.assertRaises(ValidationError):
            Passage.objects.create(text=None)


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

    def test_match(self):
        self.assertTrue(self.rule.match('test matches ^test'))
        self.assertTrue(self.rule.match('TeSt matches ^test'))
        self.assertFalse(self.rule.match('WRONG does not match ^test'))
