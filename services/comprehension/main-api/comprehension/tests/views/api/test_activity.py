import json

from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIRequestFactory, force_authenticate

from ...factories.activity import ActivityFactory
from ...factories.activity_passage import ActivityPassageFactory
from ...factories.activity_prompt import ActivityPromptFactory
from ...factories.passage import PassageFactory
from ...factories.prompt import PromptFactory
from ...factories.user import UserFactory
from ....models.activity import Activity
from ....views.api import ActivityViewSet


class TestActivityApiListView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = ActivityViewSet.as_view({'get': 'list'})

    def test_list_activities_format(self):
        self.activity1 = ActivityFactory()
        self.activity2 = ActivityFactory()

        request = self.factory.get(reverse('activities-list'))

        response = self.view(request)

        self.assertEqual(json.loads(response.render().content), [
            {'id': self.activity1.id, 'title': self.activity1.title},
            {'id': self.activity2.id, 'title': self.activity2.title},
        ])


class TestActivityApiRetrieveView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = ActivityViewSet.as_view({'get': 'retrieve'})

    def test_show_activity_404(self):
        request = self.factory.get(reverse('activities-detail',
                                           kwargs={'pk': 200}))

        response = self.view(request, pk=200)

        self.assertEqual(response.status_code, 404)

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

        request = self.factory.get(reverse('activities-detail',
                                           kwargs={'pk': self.activity.pk}))

        response = self.view(request, pk=self.activity.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.render().content), {
                         'id': self.activity.id,
                         'title': self.activity.title,
                         'flag': self.activity.flag,
                         'target_reading_level':
                             self.activity.target_reading_level,
                         'scored_reading_level':
                             self.activity.scored_reading_level,
                         'passages': [{
                             'id': self.passage1.id,
                             'text': self.passage1.text,
                         }, {
                             'id': self.passage2.id,
                             'text': self.passage2.text,
                         }],
                         'prompts': [{
                             'max_attempts': self.prompt1.max_attempts,
                             'max_attempts_feedback':
                                 self.prompt1.max_attempts_feedback,
                             'id': self.prompt1.id,
                             'text': self.prompt1.text,
                             'conjunction': self.prompt1.conjunction,
                         }, {
                             'max_attempts': self.prompt2.max_attempts,
                             'max_attempts_feedback':
                                 self.prompt2.max_attempts_feedback,
                             'id': self.prompt2.id,
                             'text': self.prompt2.text,
                             'conjunction': self.prompt2.conjunction,
                         }]})


class TestActivityApiCreateView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = ActivityViewSet.as_view({'post': 'create'})
        self.user = UserFactory(is_staff=True)
        self.payload = {
            "title": "Test create title",
            "target_reading_level": 4,
            "scored_reading_level": 4,
            "passages": [{"text": "Test create passage text"}],
            "prompts": [
                {
                    "text": "Test create prompt text 1",
                    "max_attempts": 5,
                    "max_attempts_feedback": "Feedback 1"
                },
                {
                    "text": "Test create prompt text 2",
                    "max_attempts": 5,
                    "max_attempts_feedback": "Feedback 2"
                },

                {
                    "text": "Test create prompt text 3",
                    "max_attempts": 5,
                    "max_attempts_feedback": "Feedback 3"
                }
            ]
        }

    def test_success_when_unauthed(self):
        request = self.factory.post(reverse('activities-list'), self.payload,
                                    format='json')

        response = self.view(request)

        self.assertEqual(response.status_code, 201)

    def test_success_when_authed(self):
        request = self.factory.post(reverse('activities-list'), self.payload,
                                    format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request)

        self.assertEqual(response.status_code, 201)
        activity = Activity.objects.filter(title=self.payload['title']).first()
        for i, passage in enumerate(activity.get_passages()):
            self.assertEqual(passage.text, self.payload['passages'][i]['text'])
        for i, prompt in enumerate(activity.get_prompts()):
            self.assertEqual(prompt.text, self.payload['prompts'][i]['text'])


class TestActivityApiUpdateView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = ActivityViewSet.as_view({'put': 'update'})
        self.activity = ActivityFactory()
        self.passage1 = PassageFactory(text='Passage1')
        ActivityPassageFactory(activity=self.activity,
                               passage=self.passage1,
                               order=1)
        self.prompt1 = PromptFactory(text='Prompt1',
                                     max_attempts_feedback='Feedback1')
        self.prompt2 = PromptFactory(text='Prompt2',
                                     max_attempts_feedback='Feedback2')
        self.prompt3 = PromptFactory(text='Prompt3',
                                     max_attempts_feedback='Feedback3')
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt1,
                              order=1)
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt2,
                              order=2)
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt3,
                              order=3)
        self.user = UserFactory(is_staff=True)
        self.payload = {
            "title": "Test create title",
            "target_reading_level": 4,
            "scored_reading_level": 4,
            "passages": [{"text": "Test create passage text"}],
            "prompts": [
                {
                    "text": "Test create prompt text 1",
                    "max_attempts": 5,
                    "max_attempts_feedback": "Feedback 1"
                },
                {
                    "text": "Test create prompt text 2",
                    "max_attempts": 5,
                    "max_attempts_feedback": "Feedback 2"
                },
                {
                    "text": "Test create prompt text 3",
                    "max_attempts": 5,
                    "max_attempts_feedback": "Feedback 3"
                }
            ]
        }

    def test_success_when_unauthed(self):
        request = self.factory.put(reverse('activities-detail',
                                           kwargs={'pk': self.activity.pk}),
                                   self.payload,
                                   format='json')

        response = self.view(request, pk=self.activity.pk)

        self.assertEqual(response.status_code, 200)

    def test_success_when_authed(self):
        request = self.factory.put(reverse('activities-detail',
                                           kwargs={'pk': self.activity.pk}),
                                   self.payload,
                                   format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request, pk=self.activity.pk)

        self.assertEqual(response.status_code, 200)
        activity = Activity.objects.filter(title=self.payload['title']).first()
        for i, passage in enumerate(activity.get_passages()):
            self.assertEqual(passage.text, self.payload['passages'][i]['text'])
        for i, prompt in enumerate(activity.get_prompts()):
            self.assertEqual(prompt.text, self.payload['prompts'][i]['text'])

    def test_update_with_additional_passage(self):
        mock_new_passage_text = 'New passage text'
        self.payload['passages'].append({'text': mock_new_passage_text})
        request = self.factory.put(reverse('activities-detail',
                                           kwargs={'pk': self.activity.pk}),
                                   self.payload,
                                   format='json')
        force_authenticate(request, user=self.user)

        original_passage_count = len(self.activity.get_passages())

        response = self.view(request, pk=self.activity.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(self.activity.get_passages()),
                         original_passage_count + 1)
        self.assertEqual(self.activity.get_passages()[-1].text,
                         mock_new_passage_text)

    def test_update_with_additional_prompt(self):
        mock_new_prompt_text = 'New passage text'
        self.payload['prompts'].append({'text': mock_new_prompt_text,
                                        'max_attempts': 5,
                                        'max_attempts_feedback': 'Feedback'})
        request = self.factory.put(reverse('activities-detail',
                                           kwargs={'pk': self.activity.pk}),
                                   self.payload,
                                   format='json')
        force_authenticate(request, user=self.user)

        original_prompt_count = len(self.activity.get_prompts())

        response = self.view(request, pk=self.activity.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(self.activity.get_prompts()),
                         original_prompt_count + 1)
        self.assertEqual(self.activity.get_prompts()[-1].text,
                         mock_new_prompt_text)

    def test_update_reorder_prompts(self):
        """
        NOTE: I am not sure that this is actually the correct behavior to
        target, but it is what we're doing right now
        """
        old_prompt_text1 = self.prompt1.text
        old_prompt_text2 = self.prompt2.text
        old_prompt_text3 = self.prompt3.text
        # New order will be 2, 3, 1
        self.payload['prompts'] = [{
            'text': self.prompt2.text,
            'max_attempts_feedback': self.prompt2.max_attempts_feedback,
        }, {
            'text': self.prompt3.text,
            'max_attempts_feedback': self.prompt3.max_attempts_feedback,
        }, {
            'text': self.prompt1.text,
            'max_attempts_feedback': self.prompt1.max_attempts_feedback,
        }]
        request = self.factory.put(reverse('activities-detail',
                                           kwargs={'pk': self.activity.pk}),
                                   self.payload,
                                   format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request, pk=self.activity.pk)

        self.assertEqual(response.status_code, 200)
        # Rather than re-ordering items, we overwrite the item that's already
        # in the specified position
        self.prompt1.refresh_from_db()
        self.prompt2.refresh_from_db()
        self.prompt3.refresh_from_db()
        self.assertEqual(self.prompt1.text, old_prompt_text2)
        self.assertEqual(self.prompt2.text, old_prompt_text3)
        self.assertEqual(self.prompt3.text, old_prompt_text1)
