import json

from django.http import Http404
from django.test import RequestFactory, TestCase

from ..factories.passage import PassageFactory
from ..factories.prompt import PromptFactory
from ..factories.activity import ActivityFactory
from ..factories.activity_prompt import ActivityPromptFactory
from ..factories.activity_passage import ActivityPassageFactory
from ...views.plagiarism import PlagiarismFeedbackView
from ...views.plagiarism import (FEEDBACK_TYPE, FEEDBACK_ID, CORRECT_FEEDBACK,
                                 INCORRECT_FEEDBACK)
from ...utils import construct_feedback_payload
from ...lib import test_constants


class TestPlagiarismFeedbackView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.passage = PassageFactory(text=test_constants.PASSAGE_TEXT)
        self.prompt = PromptFactory()
        self.activity = ActivityFactory()
        self.activity_prompt = ActivityPromptFactory(activity=self.activity,
                                                     prompt=self.prompt,
                                                     order=1)
        self.activity_passage = ActivityPassageFactory(activity=self.activity,
                                                       passage=self.passage,
                                                       order=1)

    def test_get_plagiarism_feedback_404(self):
        request_body = {
            'prompt_id': '10000000',
            'entry': 'Prompt does not exist',
        }
        request = self.factory.post('/feedback/plagiarism',
                                    data=json.dumps(request_body),
                                    content_type='application/json')

        with self.assertRaises(Http404):
            PlagiarismFeedbackView.as_view()(request)

    def test_get_not_plagiarized_feedback(self):
        request_body = {
            'prompt_id': self.prompt.id,
            'entry': 'This is a totally original sentence, not plagiarized.'
        }
        request = self.factory.post('/feedback/plagiarism',
                                    data=json.dumps(request_body),
                                    content_type='application/json')

        response = PlagiarismFeedbackView().post(request)
        json_body = json.loads(response.content)

        expected = construct_feedback_payload(
                      CORRECT_FEEDBACK,
                      FEEDBACK_TYPE,
                      True,
                      FEEDBACK_ID
                    )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_body, expected)

    def test_get_plagiarized_feedback(self):
        request_body = {
            'prompt_id': self.prompt.id,
            'entry': 'poor Bolivian factory worker who'
        }
        request = self.factory.post('/feedback/plagiarism',
                                    data=json.dumps(request_body),
                                    content_type='application/json')

        response = PlagiarismFeedbackView().post(request)
        json_body = json.loads(response.content)

        expected = construct_feedback_payload(
                      INCORRECT_FEEDBACK,
                      FEEDBACK_TYPE,
                      False,
                      FEEDBACK_ID
                    )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_body, expected)
