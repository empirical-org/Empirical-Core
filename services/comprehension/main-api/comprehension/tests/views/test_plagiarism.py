import json

from django.http import Http404
from django.test import RequestFactory, TestCase

from ..factories.passage import PassageFactory
from ..factories.prompt import PromptFactory
from ..factories.activity import ActivityFactory
from ..factories.activity_prompt import ActivityPromptFactory
from ..factories.activity_passage import ActivityPassageFactory
from ...views.plagiarism import PlagiarismFeedbackView
from ...views.plagiarism import (FEEDBACK_TYPE, FEEDBACK_ID, CORRECT_FEEDBACK)
from ...utils import construct_feedback_payload


PASSAGE_TEXT = ("This is a test passage. \n\nPlease do not plagiarize this,"
                "students!")


class TestPlagiarismFeedbackView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.passage = PassageFactory(text=PASSAGE_TEXT)
        self.prompt = PromptFactory()
        self.activity = ActivityFactory()
        self.activity_prompt = ActivityPromptFactory(activity=self.activity,
                                                     prompt=self.prompt,
                                                     order=1)
        self.activity_passage = ActivityPassageFactory(activity=self.activity,
                                                       passage=self.passage,
                                                       order=1)
        self.plagView = PlagiarismFeedbackView()

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

    def test_plagiarism_integration(self):
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

    def test_is_not_plagiarized(self):
        entry = 'This is a totally original sentence, not plagiarized.'
        self.assertFalse(self.plagView._check_is_plagiarism(entry,
                         self.passage.text))

    def test_is_plagiarized(self):
        entry = 'Please do not plagiarize this'
        self.assertTrue(self.plagView._check_is_plagiarism(entry,
                        self.passage.text))

    def test_is_plagiarized_with_punctuation(self):
        entry = 'Please, do not!! plagiarize this? students'
        self.assertTrue(self.plagView._check_is_plagiarism(entry,
                        self.passage.text))

    def test_is_plagiarized_with_capitalization(self):
        entry = 'please DO NOT plagiariZE THis'
        self.assertTrue(self.plagView._check_is_plagiarism(entry,
                        self.passage.text))

    def test_is_plagiarized_across_paragraphs(self):
        entry = 'test passage please DO NOT yada yada'
        self.assertTrue(self.plagView._check_is_plagiarism(entry,
                        self.passage.text))
