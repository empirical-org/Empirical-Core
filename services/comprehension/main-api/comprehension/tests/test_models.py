from django.core.exceptions import ValidationError
from django.test import TestCase

from .factories.prompt import PromptFactory
from ..models.activity import Activity
from ..models.activity import ActivityPassage
from ..models.activity import ActivityPrompt
from ..models.passage import Passage


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(title='Test Activity',
                                                flag=Activity.FLAGS.DRAFT)

    def test_title_not_nullable(self):
        self.activity.title = None
        with self.assertRaises(ValidationError):
            self.activity.save()

    def test_flag_validation(self):
        self.activity.flag = 'DEFINITELY NOT A VALID FLAG'
        with self.assertRaises(ValidationError):
            self.activity.save()

    def test_get_passages_order(self):
        self.passage1 = Passage.objects.create(text='passage1')
        self.passage2 = Passage.objects.create(text='passage2')
        ActivityPassage.objects.create(activity=self.activity,
                                       passage=self.passage2,
                                       order=1)
        ActivityPassage.objects.create(activity=self.activity,
                                       passage=self.passage1,
                                       order=2)

        self.assertEqual(self.activity.get_passages(),
                         [self.passage2, self.passage1])

    def test_get_prompts_order(self):
        self.prompt1 = PromptFactory(text='prompt1')
        self.prompt2 = PromptFactory(text='prompt2')
        ActivityPrompt.objects.create(activity=self.activity,
                                      prompt=self.prompt2,
                                      order=1)
        ActivityPrompt.objects.create(activity=self.activity,
                                      prompt=self.prompt1,
                                      order=2)

        self.assertEqual(self.activity.get_prompts(),
                         [self.prompt2, self.prompt1])


class PassageModelTest(TestCase):
    def test_text_not_null(self):
        with self.assertRaises(ValidationError):
            Passage.objects.create()
