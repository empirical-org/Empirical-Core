from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.activity import ActivityFactory
from ..factories.activity_passage import ActivityPassageFactory
from ..factories.activity_prompt import ActivityPromptFactory
from ..factories.passage import PassageFactory
from ..factories.prompt import PromptFactory


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
