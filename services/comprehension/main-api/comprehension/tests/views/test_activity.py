import json

from django.http import Http404
from django.test import RequestFactory, TestCase
from django.urls import reverse

from ..factories.activity import ActivityFactory
from ..factories.activity_passage import ActivityPassageFactory
from ..factories.activity_prompt import ActivityPromptFactory
from ..factories.passage import PassageFactory
from ..factories.prompt import PromptFactory
from ...views.activity import ActivityView


class TestActivityView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_show_activity_404(self):
        request = self.factory.get(f"/activities/200")

        with self.assertRaises(Http404):
            ActivityView().get(request, 200)

    def test_show_activity_format(self):
        self.activity = ActivityFactory()
        self.passage1 = PassageFactory(text='Passage1')
        self.passage2 = PassageFactory(text='Passage2')
        ActivityPassageFactory(activity=self.activity,
                               passage=self.passage1,
                               order=1)
        ActivityPassageFactory(activity=self.activity,
                               passage=self.passage2,
                               order=2)
        self.prompt1 = PromptFactory(text='Prompt1',
                                     max_attempts_feedback='Feedback1')
        self.prompt2 = PromptFactory(text='Prompt2',
                                     max_attempts_feedback='Feedback2')
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt1,
                              order=1)
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt2,
                              order=2)

        request = self.factory.get(f"/activities/{self.activity.id}")

        response = ActivityView().get(request, self.activity.id)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content), {
                         'activity_id': self.activity.id,
                         'passages': [self.passage1.text,
                                      self.passage2.text],
                         'prompts': [{
                             'max_attempts': self.prompt1.max_attempts,
                             'max_attempts_feedback':
                                 self.prompt1.max_attempts_feedback,
                             'prompt_id': self.prompt1.id,
                             'text': self.prompt1.text
                         }, {
                             'max_attempts': self.prompt2.max_attempts,
                             'max_attempts_feedback':
                                 self.prompt2.max_attempts_feedback,
                             'prompt_id': self.prompt2.id,
                             'text': self.prompt2.text
                         }],
                         'title': self.activity.title})
