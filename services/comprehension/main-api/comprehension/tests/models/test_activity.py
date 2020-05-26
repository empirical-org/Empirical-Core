from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.activity import ActivityFactory
from ..factories.activity_passage import ActivityPassageFactory
from ..factories.activity_prompt import ActivityPromptFactory
from ..factories.passage import PassageFactory
from ..factories.prompt import PromptFactory
from ...models.activity import Activity


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = ActivityFactory()

    def test_title_not_nullable(self):
        self.activity.title = None
        with self.assertRaises(ValidationError):
            self.activity.full_clean()

    def test_flag_validation(self):
        self.activity.flag = 'DEFINITELY NOT A VALID FLAG'
        with self.assertRaises(ValidationError):
            self.activity.full_clean()

    def test_flag_default_to_draft(self):
        new_act = Activity(title=self.activity.title)
        self.assertEqual(new_act.flag, Activity.FLAGS.ALPHA)

    def test_target_reading_level_nullable(self):
        self.activity.target_reading_level = None
        self.assertIsNone(self.activity.full_clean())

    def test_target_reading_level_min_validation(self):
        self.activity.target_reading_level = 3  # min is 4
        with self.assertRaises(ValidationError):
            self.assertIsNone(self.activity.full_clean())

    def test_target_reading_level_max_validation(self):
        self.activity.target_reading_level = 13  # max is 12
        with self.assertRaises(ValidationError):
            self.assertIsNone(self.activity.full_clean())

    def test_scored_reading_level_nullable(self):
        self.activity.scored_reading_level = None
        self.assertIsNone(self.activity.full_clean())

    def test_get_passages_order(self):
        self.passage1 = PassageFactory(text='passage1')
        self.passage2 = PassageFactory(text='passage2')
        ap1 = ActivityPassageFactory(activity=self.activity,
                                     passage=self.passage1,
                                     order=1)
        ap2 = ActivityPassageFactory(activity=self.activity,
                                     passage=self.passage2,
                                     order=2)

        self.assertEqual(self.activity.get_passages(),
                         [self.passage1, self.passage2])

        ap1.order = 2
        ap1.save()
        ap2.order = 1
        ap2.save()

        self.assertEqual(self.activity.get_passages(),
                         [self.passage2, self.passage1])

    def test_get_prompts_order(self):
        self.prompt1 = PromptFactory(text='prompt1')
        self.prompt2 = PromptFactory(text='prompt2')
        ap1 = ActivityPromptFactory(activity=self.activity,
                                    prompt=self.prompt1,
                                    order=1)
        ap2 = ActivityPromptFactory(activity=self.activity,
                                    prompt=self.prompt2,
                                    order=2)

        self.assertEqual(self.activity.get_prompts(),
                         [self.prompt1, self.prompt2])

        ap1.order = 2
        ap1.save()
        ap2.order = 1
        ap2.save()

        self.assertEqual(self.activity.get_prompts(),
                         [self.prompt2, self.prompt1])
