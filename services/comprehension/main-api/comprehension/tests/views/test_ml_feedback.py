import json
from unittest.mock import patch

from django.http import Http404
from django.test import RequestFactory, TestCase
from django.urls import reverse

from ..factories.ml_feedback import MLFeedbackFactory
from ..factories.prompt import PromptFactory
from ..mocks.google_auto_ml import generate_auto_ml_label_response_mock
from ...models.ml_model import MLModel
from ...views import get_single_label_ml_feedback, get_multi_label_ml_feedback
from ...utils import construct_feedback_payload


def mock_google_auto_ml_response(*args, **kwargs):
    return [
        generate_auto_ml_label_response_mock(score=0.1, label='Lowest'),
        generate_auto_ml_label_response_mock(score=0.6, label='Middle'),
        generate_auto_ml_label_response_mock(score=0.9, label='Highest'),
    ]


@patch.object(MLModel, '_request_google_auto_ml_response', mock_google_auto_ml_response)
class TestMLFeedbackView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.prompt = PromptFactory()
        self.ml_feedback_single = MLFeedbackFactory(combined_labels='Highest',
                                                    prompt=self.prompt,
                                                    feedback='Single label feedback')
        self.ml_feedback_multi = MLFeedbackFactory(combined_labels='Highest_Middle',
                                                   prompt=self.prompt,
                                                   feedback='Multi label feedback')
        self.request_body = {
            'prompt_id': self.prompt.id,
            'entry': 'SAMPLE ENTRY',
        }

    def test_get_single_label_ml_feedback(self):
        request = self.factory.post(reverse('get_single_label_ml_feedback'),
                                    data=json.dumps(self.request_body),
                                    content_type='application/json')

        response = get_single_label_ml_feedback(request)
        json_body = json.loads(response.content)

        self.assertEqual(response.status_code, 200)
        expected_payload = construct_feedback_payload(self.ml_feedback_single.feedback,
                                                      'auto_ml_semantic',
                                                      self.ml_feedback_single.optimal)
   
        self.assertEqual(json_body, expected_payload)

    def test_get_multi_label_ml_feedback(self):
        request = self.factory.post(reverse('get_multi_label_ml_feedback'),
                                    data=json.dumps(self.request_body),
                                    content_type='application/json')

        response = get_multi_label_ml_feedback(request)
        json_body = json.loads(response.content)

        expected_payload = construct_feedback_payload(self.ml_feedback_multi.feedback,
                                                      'auto_ml_semantic',
                                                      self.ml_feedback_multi.optimal)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_body, expected_payload)
