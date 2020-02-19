import json
from unittest.mock import patch

from django.test import RequestFactory, TestCase
from django.urls import reverse

from ..factories.ml_feedback import MLFeedbackFactory
from ..factories.prompt import PromptFactory
from ...models.feedback_history import FeedbackHistory
from ...views.feedback_history import FeedbackHistoryView


class TestFeedbackHistoryView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch.object(FeedbackHistory.objects, 'create')
    def test_post_feedback_history(self, mock_create):
        prompt = PromptFactory()
        request_body = {
            'attempt': 1,
            'entry': 'Mock user-submitted entry',
            'feedback': {
                'foo': 'bar',
            },
            'prompt_id': prompt.id,
            'session_id': 'MOCK_SESSION_IDENTIFIER',
        }
        request = self.factory.post(reverse('save_feedback_history'),
                                    data=json.dumps(request_body),
                                    content_type='application/json')

        response = FeedbackHistoryView().post(request)
        json_body = json.loads(response.content)

        expected = {
	    'message': 'Successfully recorded Feedback History.',
        }

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_body, expected)
        mock_create.assert_called_with(**request_body)
