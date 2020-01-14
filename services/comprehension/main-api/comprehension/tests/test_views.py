import json

from django.http import Http404
from django.test import RequestFactory, TestCase

from ..models.activity import Activity, ActivityPassage, ActivityPrompt
from ..models.passage import Passage
from ..models.prompt import Prompt
from ..views import index, show_activity, list_activities


class ViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_index(self):
        request = self.factory.get('/')

        response = index(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content,
                         b'This could return something helpful!')


class ActivityViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.activity = Activity.objects.create(title='Test Activity',
                                flag=Activity.FLAGS.DRAFT)

    def test_list_activities(self):
        request = self.factory.get('/activities')

        response = list_activities(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content,
                         b'There are 1 Activities in the DB')

    def test_show_activity_404(self):
        request = self.factory.get(f"/activities/200")

        with self.assertRaises(Http404):
            show_activity(request, 200)

    def test_show_activity_format(self):
        self.passage1 = Passage.objects.create(text='Passage1')
        self.passage2 = Passage.objects.create(text='Passage2')
        ActivityPassage.objects.create(activity=self.activity,
                                       passage=self.passage1,
                                       order=1)
        ActivityPassage.objects.create(activity=self.activity,
                                       passage=self.passage2,
                                       order=2)
        self.prompt1 = Prompt.objects.create(text='Prompt1',
                                             max_attempts_feedback='Feedback1')
        self.prompt2 = Prompt.objects.create(text='Prompt2',
                                             max_attempts_feedback='Feedback2')
        ActivityPrompt.objects.create(activity=self.activity,
                                      prompt=self.prompt1,
                                      order=1)
        ActivityPrompt.objects.create(activity=self.activity,
                                      prompt=self.prompt2,
                                      order=2)

        request = self.factory.get(f"/activities/{self.activity.id}")

        response = show_activity(request, self.activity.id)

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

